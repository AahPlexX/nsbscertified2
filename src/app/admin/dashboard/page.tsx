"use client";  

const [error, setError] = useState<string>(null);  
const { isAuthenticated, userRole } = useUserStore();  

async function fetchDashboardData(): Promise<void> {  
  try {  
    setIsLoading(true);  
    setError(null);  

    const responses = await Promise.all([  
      fetch("/api/admin/stats/users"),  
      fetch("/api/admin/stats/payments"),  
      fetch("/api/admin/stats/exams"),  
    ]);  

    const [userStatsRes, paymentStatsRes, examStatsRes] = responses;  

    if (!userStatsRes.ok || !paymentStatsRes.ok || !examStatsRes.ok) {  
      throw createError("Failed to fetch dashboard data");  
    }  

    const [userData, paymentData, examData] = await Promise.all([  
      userStatsRes.json(),  
      paymentStatsRes.json(),  
      examStatsRes.json(),  
    ]);  

    setUserStats(userData);  
    setPaymentStats(paymentData);  
    setExamStats(examData);  
  } catch (err) {  
    console.error("Dashboard data fetch error:", err);  
    setError(err instanceof Error ? err.message : "Failed to load dashboard data");  
  } finally {  
    setIsLoading(false);  
  }  
}  

useEffect(() => {  
  if (isAuthenticated && userRole === "ADMIN") {  
    fetchDashboardData();  
  }  
}, [isAuthenticated, userRole]);  

if (!isAuthenticated || userRole !== "ADMIN") {  
  return (  
    <div className="flex min-h-screen items-center justify-center">  
      <Card>  
        <div className="p-6 text-center">  
          <h1 className="text-xl font-semibold text-red-600">  
            Access Denied  
          </h1>  
          <p className="mt-2">You must be an admin to view this page.</p>  
        </div>  
      </Card>  
    </div>  
  );  
}  

if (isLoading) {  
  return (  
    <div className="flex min-h-screen items-center justify-center">  
      <div className="text-center space-y-2">  
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>  
        <p className="text-sm text-gray-600">Loading dashboard data...</p>  
      </div>  
    </div>  
  );  
}  

function createError(message: string): Error {  
  const err = new Error(message);  
  err.name = "DashboardDataFetchError";  
  return err;  
}  

// Changes made:  
// 1. Added explicit error type for state  
// 2. Extracted fetch logic into a separate async function  
// 3. Added proper error handling with custom Error type  
// 4. Improved loading spinner UI  
// 5. Added better typing for Promise.all responses  
// 6. Added proper error message handling in catch block