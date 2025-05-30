# Cloudflare R2 CORS Configuration

## You need to configure CORS for your R2 bucket to allow preview functionality

### Method 1: Using Cloudflare Dashboard
1. Go to your Cloudflare Dashboard
2. Navigate to R2 Object Storage
3. Select your bucket
4. Go to Settings > CORS policy
5. Add this CORS configuration:

```json
[
  {
    "AllowedOrigins": [
      "http://localhost:3000",
      "https://yourdomain.com"
    ],
    "AllowedMethods": [
      "GET",
      "PUT",
      "POST",
      "DELETE",
      "HEAD"
    ],
    "AllowedHeaders": [
      "*"
    ],
    "ExposedHeaders": [
      "Content-Length",
      "Content-Type",
      "ETag"
    ],
    "MaxAgeSeconds": 3600
  }
]
```

### Method 2: Using Wrangler CLI
1. Install Wrangler: `npm install -g wrangler`
2. Create a file called `cors.json` with the above configuration
3. Run: `wrangler r2 bucket cors put YOUR_BUCKET_NAME --file cors.json`

### Method 3: Using AWS CLI (compatible with R2)
```bash
aws s3api put-bucket-cors \
  --bucket YOUR_BUCKET_NAME \
  --cors-configuration file://cors.json \
  --endpoint-url https://YOUR_ACCOUNT_ID.r2.cloudflarestorage.com
```

### Environment Variables
Make sure your .env.local file has:
```
R2_ACCOUNT_ID=your_account_id
R2_ACCESS_KEY_ID=your_access_key
R2_SECRET_ACCESS_KEY=your_secret_key
R2_BUCKET=your_bucket_name
```

### Note for Production
- Replace "http://localhost:3000" with your actual domain
- You can use "*" for AllowedOrigins during development, but specify exact domains in production
- Make sure to deploy the updated API routes to your hosting platform