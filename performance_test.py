#!/usr/bin/env python3
"""
Backend Performance Testing Suite
Measures response times for all API endpoints to compare with Phase 4 benchmarks.
"""

import requests
import time
import statistics
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv('/app/frontend/.env')

# Get backend URL from frontend environment
BACKEND_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://clock-enhancement.preview.emergentagent.com')
API_BASE_URL = f"{BACKEND_URL}/api"

class PerformanceTester:
    def __init__(self):
        self.session = requests.Session()
        
    def measure_endpoint_performance(self, endpoint, method='GET', data=None, iterations=10):
        """Measure response time for an endpoint"""
        response_times = []
        
        for i in range(iterations):
            start_time = time.time()
            
            try:
                if method == 'GET':
                    response = self.session.get(f"{API_BASE_URL}{endpoint}", timeout=10)
                elif method == 'POST':
                    response = self.session.post(
                        f"{API_BASE_URL}{endpoint}",
                        json=data,
                        headers={'Content-Type': 'application/json'},
                        timeout=10
                    )
                
                end_time = time.time()
                
                if response.status_code in [200, 201]:
                    response_time_ms = (end_time - start_time) * 1000
                    response_times.append(response_time_ms)
                else:
                    print(f"Warning: {method} {endpoint} returned status {response.status_code}")
                    
            except Exception as e:
                print(f"Error testing {method} {endpoint}: {str(e)}")
                
            # Small delay between requests
            time.sleep(0.1)
        
        if response_times:
            avg_time = statistics.mean(response_times)
            min_time = min(response_times)
            max_time = max(response_times)
            
            return {
                'endpoint': f"{method} {endpoint}",
                'avg_ms': round(avg_time, 1),
                'min_ms': round(min_time, 1),
                'max_ms': round(max_time, 1),
                'samples': len(response_times)
            }
        else:
            return None
    
    def run_performance_tests(self):
        """Run performance tests on all endpoints"""
        print("=" * 60)
        print("BACKEND PERFORMANCE TESTING")
        print("=" * 60)
        
        # Test data for POST requests
        test_data = {
            "client_name": f"PerfTestClient_{int(time.time())}"
        }
        
        # Test endpoints
        endpoints = [
            ('/', 'GET', None),
            ('/status', 'GET', None),
            ('/status', 'POST', test_data)
        ]
        
        results = []
        
        for endpoint, method, data in endpoints:
            print(f"Testing {method} {endpoint}...")
            result = self.measure_endpoint_performance(endpoint, method, data)
            if result:
                results.append(result)
                print(f"  Average: {result['avg_ms']}ms (min: {result['min_ms']}ms, max: {result['max_ms']}ms)")
        
        # Calculate overall performance
        if results:
            all_avg_times = [r['avg_ms'] for r in results]
            overall_avg = statistics.mean(all_avg_times)
            
            print("\n" + "=" * 60)
            print("PERFORMANCE SUMMARY")
            print("=" * 60)
            print(f"Overall Average Response Time: {overall_avg:.1f}ms")
            print("\nDetailed Results:")
            for result in results:
                print(f"  {result['endpoint']}: {result['avg_ms']}ms")
            
            # Compare with Phase 4 benchmarks
            phase4_benchmarks = [16.2, 11.2, 10.5]  # From review request
            phase4_avg = statistics.mean(phase4_benchmarks)
            
            print(f"\nPhase 4 Benchmark Average: {phase4_avg:.1f}ms")
            improvement = ((phase4_avg - overall_avg) / phase4_avg) * 100
            print(f"Performance Change: {improvement:+.1f}%")
            
            return {
                'overall_avg_ms': overall_avg,
                'phase4_avg_ms': phase4_avg,
                'improvement_percent': improvement,
                'results': results
            }
        
        return None

if __name__ == "__main__":
    tester = PerformanceTester()
    performance_data = tester.run_performance_tests()