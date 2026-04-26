# SonarQube Integration Setup

## Prerequisites

You need to set up a SonarQube instance or use SonarCloud (SonarQube Cloud).

### Option A: SonarCloud (Recommended for GitHub)

1. **Create SonarCloud Account**
   - Go to [SonarCloud](https://sonarcloud.io)
   - Sign in with GitHub
   - Create organization (or use existing)

2. **Create Project**
   - In SonarCloud, create new project for `marka-editor`
   - Select GitHub as code repository
   - Copy the `Project Key` (displayed in Setup page)

3. **Generate Token**
   - Go to Account → Security → Tokens
   - Create new token (name it "GitHub Actions")
   - Copy the token value

4. **Add GitHub Secrets**
   - Go to repository settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Add `SONAR_TOKEN` with the token value from step 3
   - SonarCloud automatically detects `SONAR_HOST_URL` (no need to add)

5. **Update sonar-project.properties**
   ```properties
   sonar.projectKey=your-organization_marka-editor
   sonar.organization=your-organization
   ```

### Option B: Self-Hosted SonarQube

1. **Deploy SonarQube Server**
   - Install SonarQube on your server
   - Configure database and plugins

2. **Create Project**
   - Log in to SonarQube admin console
   - Create new project
   - Copy the `Project Key`

3. **Generate Token**
   - Go to Administration → Security → Users → Tokens
   - Create new token for CI/CD
   - Copy token value

4. **Add GitHub Secrets**
   - Repository settings → Secrets and variables → Actions
   - Add `SONAR_TOKEN` with token from step 3
   - Add `SONAR_HOST_URL` with your SonarQube server URL (e.g., `https://sonar.example.com`)

5. **Update sonar-project.properties**
   ```properties
   sonar.projectKey=marka-editor
   sonar.organization=your-org
   ```

## Workflow Behavior

The GitHub Actions workflow will:
1. ✅ Check out code with full history (for analysis relevancy)
2. ✅ Install dependencies with `npm install --legacy-peer-deps`
3. ✅ Run linter with `npm run lint`
4. ✅ Build project with `npm run build`
5. ✅ Send analysis results to SonarQube/SonarCloud

### Triggers
- **On push to main** — Runs full analysis
- **On pull request** — Runs analysis and blocks merge if quality gate fails

## Viewing Results

### SonarCloud
- Dashboard: `https://sonarcloud.io/project/overview?id=your-organization_marka-editor`

### Self-Hosted SonarQube
- Dashboard: `https://your-sonar-server/dashboard?id=marka-editor`

## Common Issues

### "SONAR_TOKEN not found"
- Check that the secret exists in repository settings
- Verify secret name is exactly `SONAR_TOKEN`
- Wait a few minutes for secret to propagate

### "Quality gate failed"
- Check SonarQube project quality gate rules
- Fix issues reported in SonarQube dashboard
- Ensure code coverage meets project requirements

### "Analysis not running"
- Verify `sonar-project.properties` has correct `sonar.projectKey`
- For SonarCloud, ensure `sonar.organization` matches your organization
- Check GitHub Actions logs for detailed error messages

## Next Steps

1. Add test coverage reporting (when tests are added)
2. Configure quality gate rules in SonarQube
3. Set up pull request decorations (comments on PRs)
4. Configure custom rules for team standards
