
# 🧠 End-to-End MLOps Project with AWS SageMaker

This guide outlines the complete MLOps lifecycle using **AWS SageMaker**, from data ingestion to model monitoring and CI/CD.

---

## 🔧 Prerequisites

- AWS Account with SageMaker and S3 access
- IAM roles for SageMaker, S3, CloudWatch
- Python with `boto3`, `sagemaker`, `scikit-learn`, `pandas`
- (Optional) GitHub repo with CI/CD enabled

---

## Step 1: Problem Definition & Data Collection

Upload data to S3:

```python
import boto3

s3 = boto3.client("s3")
s3.upload_file("data.csv", "my-sagemaker-bucket", "mlops/data.csv")
```

---

## Step 2: Model Development

Use a local or SageMaker Notebook Instance.

Example `train.py`:

```python
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
import joblib

df = pd.read_csv("s3://my-sagemaker-bucket/mlops/data.csv")
X, y = df.drop("target", axis=1), df["target"]

model = RandomForestClassifier()
model.fit(X, y)

joblib.dump(model, "model.joblib")
```

---

## Step 3: SageMaker Training Job

Use the SageMaker Python SDK:

```python
from sagemaker.sklearn.estimator import SKLearn

estimator = SKLearn(
    entry_point="train.py",
    role="arn:aws:iam::123456789012:role/SageMakerExecutionRole",
    instance_type="ml.m5.large",
    framework_version="0.23-1",
    py_version="py3",
    base_job_name="mlops-training"
)

estimator.fit({"train": "s3://my-sagemaker-bucket/mlops/data.csv"})
```

---

## Step 4: Evaluation and Logging

Evaluate performance in `train.py` and save metrics to the `output/` directory for SageMaker capture.

---

## Step 5: Model Registration

Register model in SageMaker Model Registry:

```python
model_package = estimator.register(
    content_types=["text/csv"],
    response_types=["text/csv"],
    inference_instances=["ml.m5.large"],
    transform_instances=["ml.m5.large"],
    model_package_group_name="MyModelGroup",
    approval_status="PendingManualApproval"
)
```

---

## Step 6: Model Deployment

Deploy registered model:

```python
from sagemaker import ModelPackage

model = ModelPackage(
    role="arn:aws:iam::123456789012:role/SageMakerExecutionRole",
    model_package_arn=model_package.model_package_arn
)

predictor = model.deploy(initial_instance_count=1, instance_type="ml.m5.large")
```

---

## Step 7: Inference and Testing

Make predictions:

```python
response = predictor.predict([[value1, value2, value3]])
```

---

## Step 8: Model Monitoring

Use SageMaker Model Monitor to detect drift:

```python
from sagemaker.model_monitor import DefaultModelMonitor

monitor = DefaultModelMonitor(
    role=role,
    instance_count=1,
    instance_type="ml.m5.large",
    volume_size_in_gb=20,
    max_runtime_in_seconds=1800
)

monitor.suggest_baseline(
    baseline_dataset="s3://.../train.csv",
    dataset_format={"csv": {"header": True}},
    output_s3_uri="s3://.../monitoring/baseline"
)
```

---

## Step 9: Automate with SageMaker Pipelines

Create automated training and deployment pipelines:

```python
from sagemaker.workflow.pipeline import Pipeline
from sagemaker.workflow.steps import ProcessingStep, TrainingStep

pipeline = Pipeline(
    name="MyMLOpsPipeline",
    steps=[step_process, step_train, step_register, step_deploy]
)

pipeline.upsert(role_arn="...")
```

---

## Step 10: CI/CD with GitHub Actions or CodePipeline

Automate via:

- GitHub Actions
- AWS CodePipeline
- AWS CodeBuild

Typical flow:
- On `main` push, trigger:
    - Linting/tests
    - SageMaker Pipeline run
    - Model approval gate

---

## ✅ Summary of Tools

| Task                | AWS Tool / SDK           |
|---------------------|--------------------------|
| Dev & Training      | SageMaker Studio / Notebook |
| Experiment Tracking | SageMaker Experiments    |
| Data/Model Version  | S3, SageMaker Registry   |
| Deployment          | SageMaker Endpoints      |
| Monitoring          | SageMaker Model Monitor  |
| CI/CD               | SageMaker Pipelines, CodeBuild |
