# Confidential Client — Bridge platform

This repository holds **executable scaffolding** for the Software Factory work-order backlog: AWS infrastructure as code (WO-4, WO-60, WO-63, WO-68–79), CI (WO-13), the Bridge HTTP service (WO-5+), Lambda stubs (WO-11, WO-43/84), and Oracle DDL skeletons (WO-2, WO-26, WO-33, WO-82, WO-93).

It does **not** replace production provisioning: Oracle Cloud **WO-1**, MuleSoft org setup **WO-23–25 / WO-70**, Dynatrace **WO-39–40 / WO-90–95**, and human QA/UAT **WO-53–55** still require your environments, credentials, and runbooks.

## Prerequisites

- Python **3.9+** (CI uses 3.12).
- **AWS account** and credentials for `terraform apply`.
- **Terraform** ≥ 1.6 locally (or rely on GitHub Actions `terraform validate`).
- **Node.js** 18+ if you work on the Validator Feedback client.

## Validator Feedback (JavaScript)

The package `@pdlc/validator-feedback` in `packages/validator-feedback/` posts user feedback to the Software Factory Validator API with **validation**, **network and rate-limit handling**, and **automatic context** (relative **path only**, user agent, timestamp — no full URLs). See `packages/validator-feedback/README.md` and `examples/` for React and global error reporting.

## Quick start (application)

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -e '.[dev]'   # or: pip install .[dev] with a recent pip
export PYTHONPATH=src
uvicorn bridge.main:app --reload --port 8000
curl -s localhost:8000/health
```

Run tests:

```bash
PYTHONPATH=src pytest -q
ruff check src tests
```

## Infrastructure (Phase 1 AWS)

```bash
cd infrastructure/terraform
terraform init
terraform plan -var="environment=dev" -var="project=bridge"
```

Outputs include ALB DNS, API Gateway URL, Cognito pool/client, SQS queue URLs, CloudFront domain, and ElastiCache endpoint. The ECS service starts a **bootstrap nginx** task on port **80** so the ALB becomes healthy before you publish the Bridge image from this repo’s `Dockerfile`.

Set `alb_certificate_arn` when you have an ACM certificate for HTTPS.

## Work order mapping (high level)

| Area | Work orders (examples) | Location |
|------|-------------------------|----------|
| AWS core | 4, 60, 63, 68–79 | `infrastructure/terraform/` |
| GitHub CI | 13 (+ validate IaC) | `.github/workflows/ci.yml` |
| Bridge API | 5–9, 20–22, 33–38, 41–43, 56, 87, 92 | `src/bridge/` |
| Lambdas | 11, 43, 84 | `apps/lambda/` |
| Oracle DDL | 2, 26, 33, 82, 93 | `sql/oracle/` |
| MuleSoft | 23–25, 58, 64, 80 | *Anypoint Exchange / Studio — not in repo* |
| Validator Feedback | Integration / production feedback | `packages/validator-feedback/` |
Kafka on OpenShift (Confluent for Kubernetes KRaft provisioner) now lives in **[LeaDoy/KEES2](https://github.com/LeaDoy/KEES2)** (`kafka-ocp-provisioner/`).

Use `phase1-work-orders.json` for the Phase 1 list synced from the factory MCP.

## License / confidentiality

Treat this repo per your engagement’s confidentiality rules; do not commit secrets or `.tfvars` with real credentials.
