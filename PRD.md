# AssetFlow Enterprise
## Product Requirements Document

**Version:** 1.0  
**Product:** Enterprise Asset & Inventory Lifecycle Management System (EAILMS)  
**Target users:** Administrators, asset managers, employees, department managers, procurement, IT, finance, auditors, and executives.

## 1. Vision and objectives
AssetFlow Enterprise is the single source of truth for organizational assets, providing real-time visibility, accountability, auditability, and lifecycle management from procurement through disposal.

The product should reduce asset losses by 80%, achieve inventory accuracy above 98%, reduce audit preparation time by 90%, improve utilization, reduce unnecessary procurement, and strengthen employee accountability. Secondary goals are automated depreciation, predictive maintenance, cost optimization, and mobile-first tracking.

## 2. MVP scope
- Asset registration with generated Asset ID, serial number, category, brand, model, purchase date/cost, value, warranty, vendor, department, location, owner, status, and lifecycle stage.
- Lifecycle stages: Requested, Approved, Procured, Received, Tagged, Available, Assigned, In Maintenance, Lost, Retired, and Disposed.
- QR and barcode generation with scan-based asset lookup.
- Asset assignment, employee acceptance, digital receipt, and assignment history.
- Employee self-service for viewing assigned assets, requesting assets, reporting issues, returning assets, and requesting transfers.
- Inventory visibility across warehouses, offices, stores, and remote sites with minimum, maximum, reorder, and safety-stock levels.
- Reporting dashboard for inventory, allocation, maintenance, and lost assets.
- Notifications for assignments, returns, expiring warranties, maintenance, licenses, audits, and low stock.

## 3. Post-MVP scope
**Phase 2:** Maintenance management, procurement workflows, mobile app, and approval workflows.  
**Phase 3:** RFID, AI analytics, predictive maintenance, and enterprise integrations.

## 4. Core workflows
### Registration and assignment
1. Asset Manager registers an asset.
2. System generates an Asset ID and QR code.
3. Asset is tagged and marked Available.
4. Manager assigns it to an employee.
5. Employee accepts digitally; the system records signature, date, device, GPS location, and audit trail.

### Requests and procurement
Employee submits a request, manager approves it, procurement creates a purchase order, vendor fulfills it, and receiving records delivery.

### Audits
Auditor scans assets physically. The system compares expected and actual assets and marks each as Verified, Missing, Damaged, or Duplicate.

### Transfers and incidents
Approved department or site transfers preserve movement history. Employees can report Lost, Stolen, Damaged, or Unauthorized Usage incidents, which move through investigation to resolution.

## 5. Maintenance and finance
Support corrective and preventive maintenance, service history, scheduled reminders, and maintenance costs. Preventive schedules may be usage-based or time-based, such as a vehicle every 10,000 km, a generator every six months, or an annual laptop battery review. Support asset valuation, depreciation, and finance reporting.

## 6. Roles and security
Roles: Admin, Manager, and Employee.
Required controls: SSO, Azure AD, MFA, RBAC, encryption at rest and in transit, audit logs, and session management.

## 7. Dashboards and AI
Executive KPIs include total asset value, utilization, maintenance cost, asset loss, and inventory accuracy. Analytics include asset trends, spending trends, and department utilization. Future AI features include smart search, stock and purchasing recommendations, and predictive maintenance based on usage, incidents, and maintenance history.

## 8. Technical architecture
- **Frontend:** React, Vite, JavaScript, responsive web UI
- **Mobile:** React Native (future phase)
- **Backend:** Node.js, Express
- **Database:** MongoDB with Mongoose
- **Cache/search/storage/messaging:** Redis, Elasticsearch, Azure Blob Storage, and Azure Service Bus as scale requirements mature
- **Observability/deployment:** Azure Monitor, Application Insights, and Kubernetes for horizontal scaling

## 9. Non-functional requirements
- Asset search under 1 second.
- Dashboard load under 3 seconds.
- Scan response under 500 ms.
- Initial scale: 10,000 assets and 1,000 users.
- Target scale: 5 million assets and 100,000 users.
- Availability target: 99.95%.
- Disaster recovery target: RPO 15 minutes and RTO 1 hour.
- Compliance targets: GDPR, ISO 27001, SOX, and POPIA.

## 10. User stories and acceptance criteria
- **US-001:** Asset Manager registers an asset. Asset ID, category, serial number, and QR code are created automatically.
- **US-002:** Asset Manager assigns an asset. Employee, assignment date, acceptance, and audit trail are recorded.
- **US-003:** Employee digitally accepts an asset and responsibility is recorded.
- **US-004:** Employee requests an asset. Request, manager approval, and procurement notification are recorded.
- **US-005:** Auditor performs a QR audit. Scans update status and missing assets are flagged.
- **US-006:** Technician logs maintenance and repair history is retained.
- **US-007:** Manager receives maintenance reminders.
- **US-008:** Employee requests a transfer with approval, history, and notifications.
- **US-009:** Employee reports a lost asset; an incident is created, the manager is notified, and the asset status changes.

## 11. Success metrics
| Metric | Target |
| --- | ---: |
| Inventory accuracy | 98%+ |
| Asset loss reduction | 80% |
| Audit time reduction | 90% |
| User adoption | 95% |
| Assignment compliance | 100% |
| System availability | 99.95% |
