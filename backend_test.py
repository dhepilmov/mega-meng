#!/usr/bin/env python3
"""
Backend Testing Suite - Post Frontend Changes Verification
Tests backend server functionality after frontend routing changes
"""

import requests
import json
import time
import sys
from typing import Dict, Any
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv('/app/frontend/.env')

class BackendTester:
    def __init__(self):
        # Use the production URL from frontend/.env
        self.base_url = os.environ.get('REACT_APP_BACKEND_URL', 'https://context-mapper.preview.emergentagent.com')
        self.api_url = f"{self.base_url}/api"
        self.session = requests.Session()
        self.session.timeout = 10
        
        print(f"🔧 Testing Backend URL: {self.api_url}")
        print("=" * 60)
    
    def test_server_health(self) -> Dict[str, Any]:
        """Test if backend server is running and responding"""
        print("🏥 Testing Server Health...")
        
        try:
            response = self.session.get(f"{self.api_url}/health")
            
            result = {
                "test": "Server Health Check",
                "status": "PASS" if response.status_code == 200 else "FAIL",
                "status_code": response.status_code,
                "response_time_ms": round(response.elapsed.total_seconds() * 1000, 2),
                "details": {}
            }
            
            if response.status_code == 200:
                try:
                    data = response.json()
                    result["details"] = {
                        "response_data": data,
                        "content_type": response.headers.get('content-type', 'unknown')
                    }
                    print(f"   ✅ Server responding: {data}")
                except json.JSONDecodeError:
                    result["details"]["error"] = "Invalid JSON response"
                    result["status"] = "FAIL"
            else:
                result["details"]["error"] = f"HTTP {response.status_code}: {response.text[:200]}"
                print(f"   ❌ Server health check failed: {response.status_code}")
                
        except requests.exceptions.RequestException as e:
            result = {
                "test": "Server Health Check",
                "status": "FAIL",
                "details": {"error": f"Connection error: {str(e)}"}
            }
            print(f"   ❌ Connection failed: {e}")
            
        return result
    
    def test_basic_api_endpoints(self) -> Dict[str, Any]:
        """Test basic API endpoints functionality"""
        print("\n🔌 Testing Basic API Endpoints...")
        
        endpoints = [
            {"path": "/", "method": "GET", "description": "Root endpoint"},
            {"path": "/health", "method": "GET", "description": "Health check endpoint"}
        ]
        
        results = []
        
        for endpoint in endpoints:
            print(f"   Testing {endpoint['method']} {endpoint['path']}...")
            
            try:
                url = f"{self.api_url}{endpoint['path']}"
                response = self.session.request(endpoint['method'], url)
                
                result = {
                    "endpoint": endpoint['path'],
                    "method": endpoint['method'],
                    "description": endpoint['description'],
                    "status": "PASS" if response.status_code == 200 else "FAIL",
                    "status_code": response.status_code,
                    "response_time_ms": round(response.elapsed.total_seconds() * 1000, 2),
                    "details": {}
                }
                
                if response.status_code == 200:
                    try:
                        data = response.json()
                        result["details"]["response_data"] = data
                        print(f"      ✅ {endpoint['description']}: {data}")
                    except json.JSONDecodeError:
                        result["details"]["response_text"] = response.text[:100]
                        print(f"      ✅ {endpoint['description']}: {response.text[:50]}...")
                else:
                    result["details"]["error"] = f"HTTP {response.status_code}: {response.text[:200]}"
                    print(f"      ❌ {endpoint['description']} failed: {response.status_code}")
                    
                results.append(result)
                
            except requests.exceptions.RequestException as e:
                result = {
                    "endpoint": endpoint['path'],
                    "method": endpoint['method'],
                    "description": endpoint['description'],
                    "status": "FAIL",
                    "details": {"error": f"Connection error: {str(e)}"}
                }
                results.append(result)
                print(f"      ❌ {endpoint['description']} connection failed: {e}")
        
        return {
            "test": "Basic API Endpoints",
            "overall_status": "PASS" if all(r["status"] == "PASS" for r in results) else "FAIL",
            "endpoints_tested": len(results),
            "endpoints_passed": len([r for r in results if r["status"] == "PASS"]),
            "results": results
        }
    
    def test_cors_configuration(self) -> Dict[str, Any]:
        """Test CORS configuration"""
        print("\n🌐 Testing CORS Configuration...")
        
        try:
            # Test preflight request
            headers = {
                'Origin': 'https://example.com',
                'Access-Control-Request-Method': 'GET',
                'Access-Control-Request-Headers': 'Content-Type'
            }
            
            response = self.session.options(f"{self.api_url}/health", headers=headers)
            
            cors_headers = {
                'access-control-allow-origin': response.headers.get('access-control-allow-origin'),
                'access-control-allow-methods': response.headers.get('access-control-allow-methods'),
                'access-control-allow-headers': response.headers.get('access-control-allow-headers'),
                'access-control-allow-credentials': response.headers.get('access-control-allow-credentials')
            }
            
            # Test actual request with CORS headers
            get_response = self.session.get(f"{self.api_url}/health", headers={'Origin': 'https://example.com'})
            
            result = {
                "test": "CORS Configuration",
                "status": "PASS" if response.status_code in [200, 204] else "FAIL",
                "preflight_status_code": response.status_code,
                "actual_request_status_code": get_response.status_code,
                "cors_headers": cors_headers,
                "details": {}
            }
            
            if response.status_code in [200, 204]:
                print(f"   ✅ CORS preflight successful")
                print(f"   ✅ Allow-Origin: {cors_headers['access-control-allow-origin']}")
                print(f"   ✅ Allow-Methods: {cors_headers['access-control-allow-methods']}")
                print(f"   ✅ Allow-Headers: {cors_headers['access-control-allow-headers']}")
            else:
                result["details"]["error"] = f"CORS preflight failed: {response.status_code}"
                print(f"   ❌ CORS preflight failed: {response.status_code}")
                
        except requests.exceptions.RequestException as e:
            result = {
                "test": "CORS Configuration",
                "status": "FAIL",
                "details": {"error": f"Connection error: {str(e)}"}
            }
            print(f"   ❌ CORS test connection failed: {e}")
            
        return result
    
    def test_performance_metrics(self) -> Dict[str, Any]:
        """Test basic performance metrics"""
        print("\n⚡ Testing Performance Metrics...")
        
        endpoints = ["/", "/health"]
        performance_data = []
        
        for endpoint in endpoints:
            times = []
            print(f"   Testing {endpoint} performance (5 requests)...")
            
            for i in range(5):
                try:
                    start_time = time.time()
                    response = self.session.get(f"{self.api_url}{endpoint}")
                    end_time = time.time()
                    
                    if response.status_code == 200:
                        response_time = (end_time - start_time) * 1000
                        times.append(response_time)
                    
                except requests.exceptions.RequestException:
                    pass
            
            if times:
                avg_time = sum(times) / len(times)
                performance_data.append({
                    "endpoint": endpoint,
                    "avg_response_time_ms": round(avg_time, 2),
                    "min_time_ms": round(min(times), 2),
                    "max_time_ms": round(max(times), 2),
                    "successful_requests": len(times)
                })
                print(f"      ✅ {endpoint}: {round(avg_time, 2)}ms average")
            else:
                performance_data.append({
                    "endpoint": endpoint,
                    "error": "No successful requests"
                })
                print(f"      ❌ {endpoint}: No successful requests")
        
        overall_avg = sum([p.get("avg_response_time_ms", 0) for p in performance_data if "avg_response_time_ms" in p])
        if performance_data:
            overall_avg = overall_avg / len([p for p in performance_data if "avg_response_time_ms" in p])
        
        return {
            "test": "Performance Metrics",
            "status": "PASS" if all("error" not in p for p in performance_data) else "FAIL",
            "overall_avg_response_time_ms": round(overall_avg, 2) if overall_avg > 0 else "N/A",
            "endpoint_performance": performance_data
        }
    
    def run_all_tests(self) -> Dict[str, Any]:
        """Run all backend tests"""
        print("🚀 Starting Backend Functionality Tests")
        print("=" * 60)
        
        test_results = {
            "test_suite": "Backend Functionality Verification",
            "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
            "base_url": self.api_url,
            "tests": []
        }
        
        # Run individual tests
        tests = [
            self.test_server_health,
            self.test_basic_api_endpoints,
            self.test_cors_configuration,
            self.test_performance_metrics
        ]
        
        for test_func in tests:
            try:
                result = test_func()
                test_results["tests"].append(result)
            except Exception as e:
                error_result = {
                    "test": test_func.__name__,
                    "status": "ERROR",
                    "details": {"error": f"Test execution error: {str(e)}"}
                }
                test_results["tests"].append(error_result)
                print(f"   ❌ Test {test_func.__name__} failed with error: {e}")
        
        # Calculate overall results
        total_tests = len(test_results["tests"])
        passed_tests = len([t for t in test_results["tests"] if t.get("status") == "PASS" or t.get("overall_status") == "PASS"])
        
        test_results["summary"] = {
            "total_tests": total_tests,
            "passed_tests": passed_tests,
            "failed_tests": total_tests - passed_tests,
            "success_rate": f"{(passed_tests/total_tests*100):.1f}%" if total_tests > 0 else "0%",
            "overall_status": "PASS" if passed_tests == total_tests else "FAIL"
        }
        
        return test_results

def main():
    """Main test execution"""
    tester = BackendTester()
    results = tester.run_all_tests()
    
    print("\n" + "=" * 60)
    print("📊 BACKEND TEST RESULTS SUMMARY")
    print("=" * 60)
    
    summary = results["summary"]
    print(f"Total Tests: {summary['total_tests']}")
    print(f"Passed: {summary['passed_tests']}")
    print(f"Failed: {summary['failed_tests']}")
    print(f"Success Rate: {summary['success_rate']}")
    print(f"Overall Status: {'✅ PASS' if summary['overall_status'] == 'PASS' else '❌ FAIL'}")
    
    # Print detailed results
    print("\n📋 DETAILED TEST RESULTS:")
    for test in results["tests"]:
        status_icon = "✅" if test.get("status") == "PASS" or test.get("overall_status") == "PASS" else "❌"
        test_name = test.get("test", "Unknown Test")
        print(f"{status_icon} {test_name}")
        
        if "details" in test and "error" in test["details"]:
            print(f"   Error: {test['details']['error']}")
    
    print("\n" + "=" * 60)
    
    # Save results to file
    with open('/app/backend_test_results.json', 'w') as f:
        json.dump(results, f, indent=2)
    
    print("📁 Detailed results saved to: /app/backend_test_results.json")
    
    # Return appropriate exit code
    return 0 if summary['overall_status'] == 'PASS' else 1

if __name__ == "__main__":
    sys.exit(main())