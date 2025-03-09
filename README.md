# Website Architecture Documentation  

## Overview  
This website is built using **React and Next.js (Page Router)** with **Tailwind CSS** for styling. It is hosted on **GitHub Pages**, with **Cloudflare** managing DNS and **Hostinger** handling domain registration.  

The website includes an **Admin Portal** that allows content updates via **Supabase**, which serves as the backend for database, storage, and authentication. **Spree** handles form submissions.  

## Tech Stack  
- **Frontend:** Next.js (Page Router), React, Tailwind CSS  
- **Hosting:** GitHub Pages  
- **Backend & Storage:** Supabase (Database, Storage, Authentication)  
- **Form Handling:** Spree  
- **Admin Portal:** Used for managing Supabase database and storage  
- **DNS Management:** Cloudflare  
- **Domain Registration:** Hostinger (2025-2027)  
- **Management:** Robotics PEC ID ([robotics@pec.edu.in](mailto:robotics@pec.edu.in))  

## Architecture Diagram  

```plaintext  
         +--------------------+  
         |      User          |  
         +--------------------+  
                   |  
                   v  
         +--------------------+  
         |  Website (Next.js) |  
         |  React + Tailwind  |  
         +--------------------+  
                   |  
                   v  
         +--------------------+  
         | GitHub Pages (Host)|  
         +--------------------+  
                   |  
  +----------------+----------------+  
  |                                 |  
  v                                 v  
+----------------+           +----------------+  
|  Spree (Forms) |           |  Supabase (DB, |  
|  Handles form  |           |  Storage, Auth)|  
|  submissions   |           +----------------+  
+----------------+                   |  
                                      v  
                          +----------------------+  
                          |  Admin Portal (CMS)  |  
                          |  Manages Supabase    |  
                          +----------------------+  
                                      |  
                                      v  
                          +----------------------+  
                          |  Cloudflare (DNS)    |  
                          +----------------------+  
                                      |  
                                      v  
                          +----------------------+  
                          |  Hostinger (Domain)  |  
                          +----------------------+  
```  

## Features  
✔ **Fully Static Frontend** hosted on GitHub Pages  
✔ **Dynamic Content Management** via Supabase  
✔ **Secure Form Handling** through Spree  
✔ **Admin Portal** for real-time content updates  
✔ **Cloudflare** for DNS management and security  
✔ **Hostinger** for domain registration  

## Deployment & Maintenance  
- **Updating Content:** Admins can log in to Supabase to update blogs, images, and database entries.  
- **DNS Configuration:** Cloudflare manages all domain-related settings.  
- **Hosting Updates:** GitHub Pages automatically deploys the latest website version on push to the repository.  

## Contact  
For any issues or inquiries, contact: **[robotics@pec.edu.in](mailto:robotics@pec.edu.in)**

![Site Map](https://bkbmdjdypixbskuvrkxi.supabase.co/storage/v1/object/public/media/sitemap/sitemap.jpg)