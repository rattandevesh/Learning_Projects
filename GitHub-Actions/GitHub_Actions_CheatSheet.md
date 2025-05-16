# GitHub Actions CI/CD Cheat Sheet

## 1. Basic Structure

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '16'

      - name: Install dependencies
        run: npm install

      - name: Run tests
        run: npm test
```

---

## 2. Docker Build & Push

```yaml
- name: Login to DockerHub
  uses: docker/login-action@v2
  with:
    username: ${{ secrets.DOCKER_USERNAME }}
    password: ${{ secrets.DOCKER_PASSWORD }}

- name: Build and push image
  run: |
    docker build -t myapp:${{ github.sha }} .
    docker tag myapp:${{ github.sha }} myrepo/myapp:latest
    docker push myrepo/myapp:latest
```

---

## 3. AWS Deployment Example

```yaml
- name: Configure AWS credentials
  uses: aws-actions/configure-aws-credentials@v2
  with:
    aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
    aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
    aws-region: us-east-1

- name: Deploy with AWS CLI
  run: |
    aws ecs update-service --cluster my-cluster --service my-service --force-new-deployment
```

---

## 4. Matrix Strategy

```yaml
strategy:
  matrix:
    node-version: [14, 16, 18]

steps:
  - uses: actions/setup-node@v3
    with:
      node-version: ${{ matrix.node-version }}
```

---

## 5. Secret Best Practices

- Use `${{ secrets.MY_SECRET }}`
- Never hardcode values
- Use environment protection rules for prod deployments
- Use tools like Vault, AWS Secrets Manager for advanced use cases

---

## 6. Useful Actions

| Action                                   | Purpose                      |
|------------------------------------------|------------------------------|
| actions/checkout                         | Clone repo                   |
| actions/setup-node, setup-python         | Set up runtime env           |
| docker/login-action                      | DockerHub/ECR login          |
| aws-actions/configure-aws-credentials    | Set AWS creds                |
| hashicorp/vault-action                   | Pull secrets from Vault      |

---

## 7. ArgoCD Deployment Trigger (via Comment)

```yaml
on:
  issue_comment:
    types: [created]

jobs:
  deploy:
    if: github.event.comment.body == '/argo deploy env=prod'
    runs-on: ubuntu-latest
    steps:
      - name: Trigger ArgoCD Sync
        run: |
          curl -X POST https://argocd-api.example.com/applications/myapp/sync           -H "Authorization: Bearer ${{ secrets.ARGO_TOKEN }}"
```

---

## 8. Helm Deployment Step

```yaml
- name: Deploy using Helm
  run: |
    helm upgrade --install myapp ./charts/myapp     --namespace production     --set image.tag=${{ github.sha }}
```