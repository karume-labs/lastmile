import axios from "axios";
import MockAdapter from "axios-mock-adapter";

const mock = new MockAdapter(axios, { delayResponse: 500 });

export function initMockApi() {
  if (process.env.NODE_ENV === "production" && !process.env.NEXT_PUBLIC_DEMO_MODE) {
    return;
  }

  // 1. Programmes
  const programmes = [
    { id: "PROG-001", name: "Summer Aid Distribution", status: "Active", targetAudience: "Families", startDate: "2026-06-01", endDate: "2026-08-31", budget: 50000, batchSize: 100, disbursed: 25000, pending: 25000, totalAmount: "50000", currency: "USD", createdAt: "2026-05-15T10:00:00Z" },
    { id: "PROG-002", name: "Winter Blanket Drive", status: "Draft", targetAudience: "Homeless", startDate: "2026-11-01", endDate: "2027-02-28", budget: 20000, batchSize: 50, disbursed: 0, pending: 20000, totalAmount: "20000", currency: "USD", createdAt: "2026-10-01T10:00:00Z" },
    { id: "PROG-003", name: "School Supplies 2026", status: "Completed", targetAudience: "Children", startDate: "2026-01-15", endDate: "2026-02-15", budget: 15000, batchSize: 200, disbursed: 15000, pending: 0, totalAmount: "15000", currency: "USD", createdAt: "2025-12-10T10:00:00Z" },
  ];

  mock.onGet("/programmes").reply(() => [200, { data: programmes, meta: { total: programmes.length } }]);

  // 2. Deliveries
  const deliveries = [
    { id: "DEL-101", participantName: "Alice Smith", referenceId: "REF-8A9B2C1", programmeName: "Summer Aid Distribution", amount: "150", currency: "USD", status: "sent", deliveryMethod: "direct", region: "North Zone", createdAt: "2026-07-10T08:30:00Z" },
    { id: "DEL-102", participantName: "Bob Johnson", referenceId: "REF-7X4Y9Z2", programmeName: "Winter Blanket Drive", amount: "50", currency: "USD", status: "pending", deliveryMethod: "proxy-led", region: "South Zone", createdAt: "2026-07-12T11:15:00Z" },
    { id: "DEL-103", participantName: "Charlie Brown", referenceId: "REF-3M5N7P4", programmeName: "School Supplies 2026", amount: "75", currency: "USD", status: "delivered", deliveryMethod: "direct", region: "East Zone", createdAt: "2026-07-14T09:45:00Z" },
    { id: "DEL-104", participantName: "Diana Prince", referenceId: "REF-1Q2W3E4", programmeName: "Summer Aid Distribution", amount: "200", currency: "USD", status: "failed", deliveryMethod: "proxy-led", region: "West Zone", createdAt: "2026-07-15T14:20:00Z" },
  ];

  mock.onGet("/deliveries").reply(() => [200, { data: deliveries, meta: { total: deliveries.length } }]);

  // 3. Audits
  const audits = [
    { id: "AUD-991", action: "User Login Failed", actor: "unknown@example.com", target: "System", severity: "warning", timestamp: "2026-07-15T08:00:00Z" },
    { id: "AUD-992", action: "Proxy Assigned", actor: "admin@lastmile.org", target: "DEL-102", severity: "info", timestamp: "2026-07-15T09:30:00Z" },
    { id: "AUD-993", action: "Large Funds Transfer", actor: "system", target: "Programme PROG-001", severity: "critical", timestamp: "2026-07-14T16:45:00Z" },
  ];

  mock.onGet("/audits").reply(() => [200, { data: audits, meta: { total: audits.length } }]);

  // 4. Proxies
  const proxies = [
    { id: "PRX-01", name: "Alice Johnson", phone: "+1234567890", status: "active", participantCount: 45, location: "North Zone", role: "Field Agent" },
    { id: "PRX-02", name: "Bob Smith", phone: "+0987654321", status: "suspended", participantCount: 12, location: "East Zone", role: "Distributor" },
    { id: "PRX-03", name: "Charlie Davis", phone: "+1122334455", status: "active", participantCount: 89, location: "South Zone", role: "Volunteer" },
  ];

  mock.onGet("/proxies").reply(() => [200, { data: proxies, meta: { total: proxies.length } }]);

  // 5. Stagnant Funds
  const stagnantFunds = [
    { id: "FND-001", participantName: "Eve Adams", referenceId: "REF-9A8B7C", programmeName: "Emergency Relief", amount: "15000", currency: "USD", status: "stagnant", daysSinceActivity: 45, lastActivityDate: "2026-06-01T00:00:00Z" },
    { id: "FND-002", participantName: "Frank Wright", referenceId: "REF-1X2Y3Z", programmeName: "Winter Blanket Drive", amount: "25000", currency: "USD", status: "clawed-back", daysSinceActivity: 95, lastActivityDate: "2026-04-15T00:00:00Z" },
    { id: "FND-003", participantName: "Grace Lee", referenceId: "REF-5M6N7P", programmeName: "Summer Aid Distribution", amount: "5000", currency: "USD", status: "under-review", daysSinceActivity: 32, lastActivityDate: "2026-06-13T00:00:00Z" },
  ];

  mock.onGet("/stagnant-funds").reply(() => [200, { data: stagnantFunds, meta: { total: stagnantFunds.length } }]);

  // 6. Dashboard Metrics
  const dashboardMetrics = {
    totalDisbursed: "$145,250",
    activeDeliveries: "128",
    stagnantFunds: "4",
    activeProxies: "32",
    recentActivity: [
      { id: "ACT-01", description: "Batch PROG-001 disbursement started", time: "2 hours ago" },
      { id: "ACT-02", description: "System audit completed successfully", time: "5 hours ago" },
      { id: "ACT-03", description: "Proxy PRX-01 reported 15 deliveries", time: "8 hours ago" },
      { id: "ACT-04", description: "Stagnant funds flag raised for 2 accounts", time: "1 day ago" },
    ],
    pendingSyncs: [
      { id: "SYNC-01", participantName: "Alice Smith", status: "Waiting for network" },
      { id: "SYNC-02", participantName: "Bob Johnson", status: "Retrying (1/3)" },
      { id: "SYNC-03", participantName: "Charlie Brown", status: "Pending approval" },
    ]
  };

  mock.onGet("/dashboard/metrics").reply(() => [200, dashboardMetrics]);

  mock.onAny().passThrough();
  console.log("Mock API initialized.");
}

