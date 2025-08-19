#!/usr/bin/env python3
"""
Performance Testing Suite for Backend API
Measures response times and compares with previous phases
"""

import requests
import time
import statistics
import os
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables
load_dotenv('/app/frontend/.env')

# Get backend URL from frontend environment
BACKEND_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://launcher-timefix.preview.emergentagent.com')
API_BASE_URL = f"{BACKEND_URL}/api"

class PerformanceTester:
    def __init__(self):
        self.session = requests.Session()
        
    def measure_endpoint_performance(self, endpoint, method='GET', data=None, iterations=10):
        """Measure performance of a specific endpoint"""
        times = []
        
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
                    response_time = (end_time - start_time) * 1000  # Convert to milliseconds
                    times.append(response_time)
                else:
                    print(f"Warning: Request {i+1} failed with status {response.status_code}")
                    
            except Exception as e:
                print(f"Warning: Request {i+1} failed with error: {e}")
                
            # Small delay between requests
            time.sleep(0.1)
        
        if times:
            return {
                'avg': statistics.mean(times),
                'min': min(times),
                'max': max(times),
                'median': statistics.median(times),
                'count': len(times)
            }
        else:
            return None
    
    def run_performance_tests(self):
        """Run comprehensive performance tests"""
        print("=" * 60)
        print("BACKEND PERFORMANCE TESTING SUITE")
        print("=" * 60)
        
        # Test 1: GET /api/ (root endpoint)
        print("Testing GET /api/ endpoint...")
        root_perf = self.measure_endpoint_performance("/", method='GET', iterations=10)
        
        # Test 2: GET /api/status
        print("Testing GET /api/status endpoint...")
        status_get_perf = self.measure_endpoint_performance("/status", method='GET', iterations=10)
        
        # Test 3: POST /api/status
        print("Testing POST /api/status endpoint...")
        test_data = {"client_name": f"PerfTest_{datetime.now().strftime('%Y%m%d_%H%M%S')}"}
        status_post_perf = self.measure_endpoint_performance("/status", method='POST', data=test_data, iterations=10)
        
        # Display results
        print("\n" + "=" * 60)
        print("PERFORMANCE RESULTS")
        print("=" * 60)
        
        endpoints = [
            ("GET /api/", root_perf),
            ("GET /api/status", status_get_perf),
            ("POST /api/status", status_post_perf)
        ]
        
        for endpoint_name, perf_data in endpoints:
            if perf_data:
                print(f"\n{endpoint_name}:")
                print(f"  Average: {perf_data['avg']:.1f}ms")
                print(f"  Minimum: {perf_data['min']:.1f}ms")
                print(f"  Maximum: {perf_data['max']:.1f}ms")
                print(f"  Median:  {perf_data['median']:.1f}ms")
                print(f"  Samples: {perf_data['count']}")
            else:
                print(f"\n{endpoint_name}: FAILED - No successful requests")
        
        # Compare with previous phases
        print("\n" + "=" * 60)
        print("PHASE COMPARISON")
        print("=" * 60)
        print("Phase 3 Results (Previous):")
        print("  GET /api/: 27.5ms avg")
        print("  GET /api/status: 20.7ms avg") 
        print("  POST /api/status: 24.1ms avg")
        
        print(f"\nPhase 4 Results (Current):")
        if root_perf:
            print(f"  GET /api/: {root_perf['avg']:.1f}ms avg")
        if status_get_perf:
            print(f"  GET /api/status: {status_get_perf['avg']:.1f}ms avg")
        if status_post_perf:
            print(f"  POST /api/status: {status_post_perf['avg']:.1f}ms avg")
        
        # Performance analysis
        print("\n" + "=" * 60)
        print("PERFORMANCE ANALYSIS")
        print("=" * 60)
        
        if root_perf and status_get_perf and status_post_perf:
            avg_current = (root_perf['avg'] + status_get_perf['avg'] + status_post_perf['avg']) / 3
            avg_phase3 = (27.5 + 20.7 + 24.1) / 3
            
            if avg_current <= avg_phase3 * 1.1:  # Within 10% is considered maintained
                print("✅ Performance MAINTAINED or IMPROVED from Phase 3")
            else:
                print("⚠️  Performance degraded compared to Phase 3")
                
            print(f"Phase 3 Average: {avg_phase3:.1f}ms")
            print(f"Phase 4 Average: {avg_current:.1f}ms")
            print(f"Change: {((avg_current - avg_phase3) / avg_phase3) * 100:+.1f}%")
        
        return {
            'root': root_perf,
            'status_get': status_get_perf,
            'status_post': status_post_perf
        }

if __name__ == "__main__":
    tester = PerformanceTester()
    results = tester.run_performance_tests()