# AssetFlow Enterprise
## Product Requirements Document (Updated)

**Version:** 2.0  
**Product:** Enterprise Asset & Inventory Lifecycle Management System (EAILMS)  
**Target users:** Administrators, asset managers, employees, department managers, auditors, and executives.  
**Current Status:** MVP Phase - Core Features Implemented

---

## 1. Executive Summary

AssetFlow Enterprise is an open-source MERN stack application for comprehensive asset lifecycle management. The MVP provides real-time asset visibility, accountability, and lifecycle tracking from procurement through disposal. The system is built on Node.js + Express backend, React frontend, and MongoDB database.

## 2. Implemented Features (MVP - Current Release)

### 2.1 Asset Management
- ✅ Asset registration with Asset ID, name, category, model, location, and purchase cost
- ✅ Status tracking: Available, Assigned, Maintenance, Lost, Retired
- ✅ Full-text search across asset name, ID, location, and category
- ✅ Asset assignment to employees with tracking
- ✅ CRUD operations (Create, Read, Update, Delete)
- ✅ Asset history with timestamps (createdAt, updatedAt)

### 2.2 Audit Management
- ✅ Audit scheduling with name, location, date, and auditor
- ✅ Audit status tracking: Scheduled, In progress, Completed
- ✅ Audit record retention and history

### 2.3 Maintenance Management
- ✅ Maintenance request submission with asset ID, issue description
- ✅ Priority levels: Low, Medium, High
- ✅ Status tracking: Open, In progress, Resolved
- ✅ Reporter tracking (who reported the issue)
- ✅ Full maintenance history

### 2.4 Dashboard & Reporting
- ✅ Overview dashboard with key metrics
- ✅ Asset inventory table with sortable columns
- ✅ Audit panel for scheduling and tracking
- ✅ Activity panel showing recent actions
- ✅ Maintenance request panel
- ✅ Portfolio/asset overview panel
- ✅ Search results view

### 2.5 Authentication & Authorization
- ✅ Role-based access control (Admin, Manager, Employee)
- ✅ User authentication with local storage
- ✅ Permission-based view restrictions
- ✅ Profile menu with user management

### 2.6 API Endpoints
- ✅ `/api/assets` - Asset CRUD and search
- ✅ `/api/audits` - Audit management
- ✅ `/api/maintenance` - Maintenance tracking
- ✅ `/api/health` - Health check endpoint

### 2.7 Technical Stack
- **Frontend:** React 18, Vite, JavaScript, CSS modules, lucide-react icons
- **Backend:** Node.js, Express.js, Mongoose ODM
- **Database:** MongoDB with schema validation
- **Build & Deploy:** npm, GitHub Actions CI/CD

## 3. Post-MVP Scope (Phase 2+)

### Phase 2 Features (Planned)
- QR/Barcode generation for assets
- Digital asset acceptance and signature capture
- Mobile-responsive audit scanning
- Approval workflows for transfers
- Asset depreciation calculations
- Preventive maintenance scheduling

### Phase 3 Features (Future)
- RFID tracking integration
- Predictive analytics and AI insights
- Mobile app (React Native)
- Azure integration (Blob Storage, Service Bus)
- Elasticsearch for advanced search
- Redis caching for performance
- SSO and Azure AD integration

## 4. Current Limitations & Known Gaps

- No QR/barcode scanning yet
- No mobile app implementation
- No advanced analytics/reporting
- Basic authentication (no SSO/MFA)
- No asset depreciation or financial tracking
- No transfer or incident workflows
- No email notifications
- Limited to web browser access

## 5. Non-Functional Requirements

- Asset search response time: &lt; 1 second
- Dashboard load time: &lt; 3 seconds  
- Initial scale target: 10,000 assets, 1,000 users
- Long-term scale target: 5M assets, 100K users
- Database: MongoDB Atlas connection via MONGODB_URI

## 6. Setup & Configuration

### Run locally:
1. Copy `.env.example` to `.env` and set `MONGODB_URI`
2. Install dependencies: `npm run install:all`
3. Start API and React app: `npm run dev`
4. Open `http://localhost:5173`

### Environment Variables:
- `MONGODB_URI`: MongoDB connection string (required) - GitHub **secret**
- `PORT`: API port, default `5000` - GitHub **variable**
- `CLIENT_URL`: Frontend URL for CORS, default `http://localhost:5173` - GitHub **variable**

The React dashboard displays demo data until MongoDB is connected. All changes are persisted to MongoDB when the backend is running.

## 7. Success Metrics

| Metric | Status | Target |
|--------|--------|--------|
| Core CRUD operations | ✅ Complete | Release ready |
| User authentication | ✅ Complete | MVP |
| Asset search | ✅ Complete | &lt; 1 second |
| Role-based access | ✅ Complete | MVP |
| Dashboard UX | ✅ Complete | Usable |
| API reliability | ✅ Validated | 99%+ |
| QR/Barcode scanning | ⏳ Planned | Phase 2 |
| Advanced analytics | ⏳ Planned | Phase 3 |
