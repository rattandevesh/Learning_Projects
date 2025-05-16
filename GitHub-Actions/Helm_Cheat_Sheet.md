# 🛠️ Helm Chart Cheat Sheet

## 📁 Helm Chart Structure

```
mychart/
├── Chart.yaml          # Metadata
├── values.yaml         # Default configuration
├── charts/             # Dependent charts
├── templates/          # Kubernetes YAML templates
│   ├── deployment.yaml
│   ├── service.yaml
│   └── _helpers.tpl    # Helper templates (functions/macros)
```

---

## 📦 Helm Chart Basics

```bash
# Create a new chart
helm create mychart

# Lint the chart
helm lint mychart/

# Install chart
helm install release-name ./mychart

# Upgrade chart
helm upgrade release-name ./mychart

# Uninstall chart
helm uninstall release-name

# Dry run with debug output
helm install --dry-run --debug release-name ./mychart
```

---

## 🧾 Chart.yaml Example

```yaml
apiVersion: v2
name: mychart
description: A Helm chart for Kubernetes
type: application
version: 0.1.0
appVersion: "1.16.0"
```

---

## ⚙️ values.yaml Example

```yaml
replicaCount: 2

image:
  repository: nginx
  tag: stable
  pullPolicy: IfNotPresent

service:
  type: ClusterIP
  port: 80
```

---

## 🧩 Template Usage (deployment.yaml)

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ include "mychart.fullname" . }}
spec:
  replicas: {{ .Values.replicaCount }}
  selector:
    matchLabels:
      app: {{ include "mychart.name" . }}
  template:
    metadata:
      labels:
        app: {{ include "mychart.name" . }}
    spec:
      containers:
        - name: {{ .Chart.Name }}
          image: "{{ .Values.image.repository }}:{{ .Values.image.tag }}"
          ports:
            - containerPort: 80
```

---

## 🔧 Useful Commands

```bash
# Render templates locally
helm template ./mychart

# List installed releases
helm list

# Show values from release
helm get values release-name

# Show all manifests
helm get manifest release-name

# Package chart
helm package ./mychart

# Add and update repo
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo update
```

---

## 📚 Tips

- Use `_helpers.tpl` for reusable template code (labels, names, etc.)
- Use `--set` or `-f custom-values.yaml` to override defaults
- Use `.Release`, `.Chart`, `.Values`, `.Files`, `.Capabilities` in templates