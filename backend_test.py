#!/usr/bin/env python3
"""
Backend API Testing Suite
Tests all backend functionality including API endpoints, MongoDB connection, and CORS configuration.
"""

import requests
import json
import os
from datetime import datetime
import uuid
import time

# Load environment variables
from dotenv import load_dotenv
load_dotenv('/app/frontend/.env')

# Get backend URL from frontend environment
BACKEND_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://launcher-timefix.preview.emergentagent.com')
API_BASE_URL = f"{BACKEND_URL}/api"

print(f"Testing backend at: {API_BASE_URL}")

class BackendTester:
    def __init__(self):
        self.session = requests.Session()
        self.test_results = []
        
    def log_test(self, test_name, success, message="", response_data=None):
        """Log test results"""
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}: {message}")
        
        self.test_results.append({
            'test': test_name,
            'success': success,
            'message': message,
            'response_data': response_data
        })
        
    def test_server_connectivity(self):
        """Test if backend server is accessible"""
        try:
            response = self.session.get(f"{API_BASE_URL}/", timeout=10)
            if response.status_code == 200:
                data = response.json()
                if data.get('message') == 'Hello World':
                    self.log_test("Server Connectivity", True, f"Server responding correctly (status: {response.status_code})", data)
                    return True
                else:
                    self.log_test("Server Connectivity", False, f"Unexpected response: {data}")
                    return False
            else:
                self.log_test("Server Connectivity", False, f"HTTP {response.status_code}: {response.text}")
                return False
        except requests.exceptions.RequestException as e:
            self.log_test("Server Connectivity", False, f"Connection error: {str(e)}")
            return False
    
    def test_cors_configuration(self):
        """Test CORS headers are properly configured"""
        try:
            # Test preflight request
            headers = {
                'Origin': 'https://example.com',
                'Access-Control-Request-Method': 'POST',
                'Access-Control-Request-Headers': 'Content-Type'
            }
            
            response = self.session.options(f"{API_BASE_URL}/status", headers=headers, timeout=10)
            
            cors_headers = {
                'access-control-allow-origin': response.headers.get('access-control-allow-origin'),
                'access-control-allow-methods': response.headers.get('access-control-allow-methods'),
                'access-control-allow-headers': response.headers.get('access-control-allow-headers')
            }
            
            if cors_headers['access-control-allow-origin']:
                self.log_test("CORS Configuration", True, f"CORS headers present: {cors_headers}")
                return True
            else:
                self.log_test("CORS Configuration", False, f"Missing CORS headers. Response headers: {dict(response.headers)}")
                return False
                
        except requests.exceptions.RequestException as e:
            self.log_test("CORS Configuration", False, f"CORS test failed: {str(e)}")
            return False
    
    def test_create_status_check(self):
        """Test POST /api/status endpoint"""
        try:
            test_data = {
                "client_name": f"TestClient_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
            }
            
            response = self.session.post(
                f"{API_BASE_URL}/status",
                json=test_data,
                headers={'Content-Type': 'application/json'},
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                
                # Validate response structure
                required_fields = ['id', 'client_name', 'timestamp']
                missing_fields = [field for field in required_fields if field not in data]
                
                if not missing_fields:
                    if data['client_name'] == test_data['client_name']:
                        self.log_test("Create Status Check", True, f"Status check created successfully", data)
                        return data  # Return created object for further testing
                    else:
                        self.log_test("Create Status Check", False, f"Client name mismatch: expected {test_data['client_name']}, got {data['client_name']}")
                        return None
                else:
                    self.log_test("Create Status Check", False, f"Missing required fields: {missing_fields}")
                    return None
            else:
                self.log_test("Create Status Check", False, f"HTTP {response.status_code}: {response.text}")
                return None
                
        except requests.exceptions.RequestException as e:
            self.log_test("Create Status Check", False, f"Request failed: {str(e)}")
            return None
        except json.JSONDecodeError as e:
            self.log_test("Create Status Check", False, f"Invalid JSON response: {str(e)}")
            return None
    
    def test_get_status_checks(self):
        """Test GET /api/status endpoint"""
        try:
            response = self.session.get(f"{API_BASE_URL}/status", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                
                if isinstance(data, list):
                    self.log_test("Get Status Checks", True, f"Retrieved {len(data)} status checks", {'count': len(data)})
                    return data
                else:
                    self.log_test("Get Status Checks", False, f"Expected list, got {type(data)}")
                    return None
            else:
                self.log_test("Get Status Checks", False, f"HTTP {response.status_code}: {response.text}")
                return None
                
        except requests.exceptions.RequestException as e:
            self.log_test("Get Status Checks", False, f"Request failed: {str(e)}")
            return None
        except json.JSONDecodeError as e:
            self.log_test("Get Status Checks", False, f"Invalid JSON response: {str(e)}")
            return None
    
    def test_data_persistence(self, created_status):
        """Test that created data persists in database"""
        if not created_status:
            self.log_test("Data Persistence", False, "No created status to verify")
            return False
            
        try:
            # Wait a moment for database write
            time.sleep(1)
            
            # Retrieve all status checks
            all_status_checks = self.test_get_status_checks()
            
            if all_status_checks is not None:
                # Look for our created status check
                found_status = None
                for status in all_status_checks:
                    if status.get('id') == created_status['id']:
                        found_status = status
                        break
                
                if found_status:
                    self.log_test("Data Persistence", True, f"Created status check found in database", found_status)
                    return True
                else:
                    self.log_test("Data Persistence", False, f"Created status check not found in database. Created ID: {created_status['id']}")
                    return False
            else:
                self.log_test("Data Persistence", False, "Could not retrieve status checks to verify persistence")
                return False
                
        except Exception as e:
            self.log_test("Data Persistence", False, f"Persistence test failed: {str(e)}")
            return False
    
    def test_error_handling(self):
        """Test API error handling with invalid data"""
        try:
            # Test with missing required field
            invalid_data = {}
            
            response = self.session.post(
                f"{API_BASE_URL}/status",
                json=invalid_data,
                headers={'Content-Type': 'application/json'},
                timeout=10
            )
            
            if response.status_code in [400, 422]:  # FastAPI returns 422 for validation errors
                self.log_test("Error Handling", True, f"Properly handled invalid data with status {response.status_code}")
                return True
            else:
                self.log_test("Error Handling", False, f"Expected 400/422 for invalid data, got {response.status_code}")
                return False
                
        except requests.exceptions.RequestException as e:
            self.log_test("Error Handling", False, f"Error handling test failed: {str(e)}")
            return False
    
    def run_all_tests(self):
        """Run all backend tests"""
        print("=" * 60)
        print("BACKEND API TESTING SUITE")
        print("=" * 60)
        
        # Test 1: Server connectivity
        server_ok = self.test_server_connectivity()
        
        if not server_ok:
            print("\n❌ Server not accessible. Stopping tests.")
            return self.generate_summary()
        
        # Test 2: CORS configuration
        self.test_cors_configuration()
        
        # Test 3: Create status check
        created_status = self.test_create_status_check()
        
        # Test 4: Get status checks
        self.test_get_status_checks()
        
        # Test 5: Data persistence
        self.test_data_persistence(created_status)
        
        # Test 6: Error handling
        self.test_error_handling()
        
        return self.generate_summary()
    
    def generate_summary(self):
        """Generate test summary"""
        print("\n" + "=" * 60)
        print("TEST SUMMARY")
        print("=" * 60)
        
        total_tests = len(self.test_results)
        passed_tests = sum(1 for result in self.test_results if result['success'])
        failed_tests = total_tests - passed_tests
        
        print(f"Total Tests: {total_tests}")
        print(f"Passed: {passed_tests}")
        print(f"Failed: {failed_tests}")
        print(f"Success Rate: {(passed_tests/total_tests)*100:.1f}%" if total_tests > 0 else "No tests run")
        
        if failed_tests > 0:
            print("\nFAILED TESTS:")
            for result in self.test_results:
                if not result['success']:
                    print(f"  - {result['test']}: {result['message']}")
        
        return {
            'total': total_tests,
            'passed': passed_tests,
            'failed': failed_tests,
            'success_rate': (passed_tests/total_tests)*100 if total_tests > 0 else 0,
            'all_passed': failed_tests == 0,
            'results': self.test_results
        }

if __name__ == "__main__":
    tester = BackendTester()
    summary = tester.run_all_tests()
    
    # Exit with appropriate code
    exit(0 if summary['all_passed'] else 1)