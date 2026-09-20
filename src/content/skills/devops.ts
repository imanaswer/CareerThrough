import type { Skill, Question, SkillPlan } from "../taxonomy";

export const skills: Skill[] = [
  {
    id: "linux",
    name: "Linux & Shell",
    dimension: "technical",
    description:
      "Can navigate a Linux server, manage files, permissions and processes, and automate routine tasks with shell commands and small scripts.",
    topics: [
      { id: "linux-filesystem", name: "Filesystem & Navigation" },
      { id: "linux-permissions", name: "Permissions & Users" },
      { id: "linux-processes", name: "Processes & Services" },
      { id: "linux-scripting", name: "Shell Scripting & Text Processing" },
    ],
  },
  {
    id: "ci-cd",
    name: "CI/CD Pipelines",
    dimension: "technical",
    description:
      "Can read, run and make small changes to an automated build-test-deploy pipeline and understands how code safely reaches production.",
    topics: [
      { id: "ci-cd-concepts", name: "CI/CD Fundamentals" },
      { id: "ci-cd-pipeline-config", name: "Pipeline Configuration & Triggers" },
      { id: "ci-cd-testing-artifacts", name: "Automated Testing, Caching & Artifacts" },
      { id: "ci-cd-deployment", name: "Deployment Strategies & Secrets" },
    ],
  },
  {
    id: "docker",
    name: "Docker & Containers",
    dimension: "technical",
    description:
      "Can package an application into a container image, run and debug containers, and wire up a small multi-container setup.",
    topics: [
      { id: "docker-images", name: "Images & Dockerfiles" },
      { id: "docker-containers", name: "Running & Debugging Containers" },
      { id: "docker-networking-volumes", name: "Networking & Volumes" },
      { id: "docker-compose", name: "Docker Compose & Multi-Container Apps" },
    ],
  },
  {
    id: "cloud-fundamentals",
    name: "Cloud Fundamentals",
    dimension: "technical",
    description:
      "Understands core cloud building blocks (compute, storage, identity, scaling) well enough to pick the right service and operate it safely.",
    topics: [
      { id: "cloud-fundamentals-models", name: "Service Models & Shared Responsibility" },
      { id: "cloud-fundamentals-compute-storage", name: "Compute & Storage Options" },
      { id: "cloud-fundamentals-iam", name: "Identity & Access Management" },
      { id: "cloud-fundamentals-scaling-cost", name: "Availability, Scaling & Cost" },
    ],
  },
  {
    id: "networking",
    name: "Networking Basics",
    dimension: "technical",
    description:
      "Can reason about how traffic reaches a service (IPs, ports, DNS, HTTP/TLS, load balancers) and troubleshoot common connectivity failures.",
    topics: [
      { id: "networking-ip-ports", name: "IP Addressing & Ports" },
      { id: "networking-dns", name: "DNS" },
      { id: "networking-http-tls", name: "HTTP & TLS" },
      { id: "networking-load-balancing-troubleshooting", name: "Load Balancing & Troubleshooting" },
    ],
  },
  {
    id: "iac",
    name: "Infrastructure as Code",
    dimension: "technical",
    description:
      "Can read and safely apply declarative infrastructure code, understanding plans, state and reusable modules.",
    topics: [
      { id: "iac-concepts", name: "Declarative Infrastructure & Idempotency" },
      { id: "iac-workflow", name: "Init, Plan & Apply Workflow" },
      { id: "iac-state", name: "State Management" },
      { id: "iac-modules-variables", name: "Variables, Modules & Environments" },
    ],
  },
  {
    id: "monitoring",
    name: "Monitoring & Observability",
    dimension: "technical",
    description:
      "Can use metrics, logs and traces to tell whether a service is healthy, set up sensible alerts, and help investigate an incident.",
    topics: [
      { id: "monitoring-signals", name: "Metrics, Logs & Traces" },
      { id: "monitoring-metrics-dashboards", name: "Key Metrics & Dashboards" },
      { id: "monitoring-alerting", name: "Alerting & SLOs" },
      { id: "monitoring-incidents", name: "Incident Response & Debugging" },
    ],
  },
];

export const questions: Question[] = [
  // ---------- linux ----------
  {
    id: "linux-q1",
    skillId: "linux",
    topicId: "linux-filesystem",
    prompt:
      "You SSH into an Ubuntu server and need to edit the system-wide configuration of an nginx install from the package manager. Following standard Linux filesystem conventions, where do you look first?",
    options: ["/var/nginx", "/home/nginx", "/etc/nginx", "/bin/nginx"],
    answer: 2,
    explanation:
      "By convention /etc holds system-wide configuration files; /var holds variable data such as logs, and /bin holds executables.",
  },
  {
    id: "linux-q2",
    skillId: "linux",
    topicId: "linux-filesystem",
    prompt:
      "`df -h` shows the root filesystem is 100% full. Which command best helps you find which directories under /var are using the most space?",
    options: [
      "du -sh /var/* | sort -h",
      "ls -l /var",
      "free -h",
      "df -h /var/*",
    ],
    answer: 0,
    explanation:
      "du -sh summarises disk usage per directory and sort -h orders the human-readable sizes. ls -l shows only the size of the directory entry, free shows memory, and df reports per filesystem rather than per directory.",
  },
  {
    id: "linux-q3",
    skillId: "linux",
    topicId: "linux-permissions",
    prompt: "You run `chmod 640 app.conf`. Who can do what with the file afterwards?",
    options: [
      "Owner: read/write/execute; group: read; others: nothing",
      "Owner: read/write; group: read; others: nothing",
      "Owner: read/write; group: read/write; others: read",
      "Owner: read; group: write; others: nothing",
    ],
    answer: 1,
    explanation:
      "Each octal digit is read(4)+write(2)+execute(1): 6 = rw- for the owner, 4 = r-- for the group, 0 = --- for others.",
  },
  {
    id: "linux-q4",
    skillId: "linux",
    topicId: "linux-permissions",
    prompt:
      "You own deploy.sh and `ls -l` shows `-rw-r--r--`. Running `./deploy.sh` fails with \"Permission denied\". What is the most appropriate fix?",
    options: [
      "Run `chown root deploy.sh`",
      "Rename it to deploy.bash",
      "Run `chmod 777 /` so everything is accessible",
      "Run `chmod +x deploy.sh` to add the execute bit",
    ],
    answer: 3,
    explanation:
      "The file has no execute permission for anyone, so the kernel refuses to run it directly. Adding the execute bit fixes it without over-granting access.",
  },
  {
    id: "linux-q5",
    skillId: "linux",
    topicId: "linux-processes",
    prompt: "You run `kill 4321` with no other flags. What happens?",
    options: [
      "SIGKILL is sent and the kernel terminates the process immediately",
      "The process is paused until you run `fg`",
      "SIGTERM is sent, asking the process to shut down; the process can catch it and clean up",
      "Nothing, because `kill` requires a signal flag",
    ],
    answer: 2,
    explanation:
      "kill sends SIGTERM (15) by default, which a process can handle for a graceful shutdown. SIGKILL (kill -9) cannot be caught and should be a last resort.",
  },
  {
    id: "linux-q6",
    skillId: "linux",
    topicId: "linux-processes",
    prompt:
      "On a systemd-based server, `myapp.service` runs fine after `systemctl start myapp`, but it is not running after a reboot. Which command fixes that?",
    options: [
      "systemctl enable myapp",
      "systemctl restart myapp",
      "systemctl status myapp",
      "systemctl daemon-reload",
    ],
    answer: 0,
    explanation:
      "start only runs the unit now; enable creates the links that make systemd start it at boot.",
  },
  {
    id: "linux-q7",
    skillId: "linux",
    topicId: "linux-scripting",
    prompt:
      "In access.log the client IP is the first field of each line. What does this pipeline print?\n\nawk '{print $1}' access.log | sort | uniq -c | sort -rn | head -5",
    options: [
      "The first 5 lines of the log, sorted alphabetically",
      "The 5 IPs with the most requests, each with its request count",
      "The 5 IPs that appear exactly once",
      "The total number of unique IPs",
    ],
    answer: 1,
    explanation:
      "awk extracts the IP, sort groups identical IPs so uniq -c can count them, sort -rn orders by count descending, and head -5 keeps the top five.",
  },
  {
    id: "linux-q8",
    skillId: "linux",
    topicId: "linux-scripting",
    prompt:
      "missing.txt does not exist and the mkdir succeeds. What does this script do?\n\n#!/bin/bash\nset -e\nmkdir /opt/app\ncp missing.txt /opt/app/\necho \"done\"",
    options: [
      "Prints an error for cp, then prints \"done\" and exits with status 0",
      "Refuses to start because of a syntax error",
      "Skips the cp silently and prints \"done\"",
      "Prints an error for cp and exits immediately with a non-zero status; \"done\" is never printed",
    ],
    answer: 3,
    explanation:
      "set -e makes the shell exit as soon as a command returns a non-zero status, so the failed cp stops the script before echo runs.",
  },

  // ---------- ci-cd ----------
  {
    id: "ci-cd-q1",
    skillId: "ci-cd",
    topicId: "ci-cd-concepts",
    prompt:
      "In a team's pipeline, every commit to main that passes all automated checks is released to production with no human approval step. What is this practice called?",
    options: ["Continuous integration", "Continuous deployment", "Continuous delivery", "Release branching"],
    answer: 1,
    explanation:
      "Continuous deployment releases every passing change automatically. Continuous delivery keeps the build always releasable but leaves the production release as a manual decision.",
  },
  {
    id: "ci-cd-q2",
    skillId: "ci-cd",
    topicId: "ci-cd-concepts",
    prompt:
      "Developers work on long-lived branches for weeks and every merge causes painful conflicts and surprise bugs. Which practice addresses this most directly?",
    options: [
      "Freezing the main branch until release week",
      "Running all tests manually before each release",
      "Giving each developer a separate production environment",
      "Merging small changes into the main branch frequently, with an automated build and test run on each one",
    ],
    answer: 3,
    explanation:
      "That is the core of continuous integration: small, frequent merges verified automatically so integration problems surface early and are cheap to fix.",
  },
  {
    id: "ci-cd-q3",
    skillId: "ci-cd",
    topicId: "ci-cd-pipeline-config",
    prompt:
      "A GitHub Actions workflow has only this trigger:\n\non:\n  push:\n    branches: [main]\n\nA developer pushes commits to a branch called feature/login and opens a pull request into main. When does the workflow run?",
    options: [
      "Not for the feature-branch pushes or the PR; only when commits land on main, for example after the merge",
      "On every push to feature/login",
      "As soon as the pull request is opened",
      "Never, because a push trigger requires a tag",
    ],
    answer: 0,
    explanation:
      "The push trigger is filtered to the main branch and there is no pull_request trigger, so only pushes to main (including the merge) start the workflow.",
  },
  {
    id: "ci-cd-q4",
    skillId: "ci-cd",
    topicId: "ci-cd-pipeline-config",
    prompt:
      "A GitHub Actions workflow defines jobs build, test and deploy. deploy is declared with `needs: [build, test]` and no `if:` condition. The test job fails. What happens to deploy?",
    options: [
      "It runs anyway because build succeeded",
      "It runs in parallel with test, so it may already have finished",
      "It is skipped, because a job it depends on failed",
      "It is retried until test passes",
    ],
    answer: 2,
    explanation:
      "needs makes deploy wait for both jobs, and by default a job is skipped when any job it needs fails.",
  },
  {
    id: "ci-cd-q5",
    skillId: "ci-cd",
    topicId: "ci-cd-testing-artifacts",
    prompt:
      "A pipeline's stages run in this order: deploy to staging (15 min), end-to-end tests (20 min), then lint and unit tests (3 min). Developers often wait 35+ minutes to learn about a typo. What is the best change?",
    options: [
      "Remove the lint and unit test stage since it is the shortest",
      "Run lint and unit tests first so cheap checks fail fast before the slow stages",
      "Run the pipeline only once a day",
      "Add more end-to-end tests to catch typos earlier",
    ],
    answer: 1,
    explanation:
      "Ordering stages from fastest/cheapest to slowest gives quick feedback and avoids spending time on deploys and end-to-end tests for a build that is already known to be broken.",
  },
  {
    id: "ci-cd-q6",
    skillId: "ci-cd",
    topicId: "ci-cd-testing-artifacts",
    prompt:
      "`npm ci` downloads the same packages for 4 minutes on every pipeline run. You add a dependency cache. Which cache key is the most sensible?",
    options: [
      "The commit SHA",
      "The current timestamp",
      "The pipeline run number",
      "A hash of package-lock.json",
    ],
    answer: 3,
    explanation:
      "Keying on the lockfile hash reuses the cache until dependencies actually change. Commit SHA, timestamp or run number change every run, so the cache would never be hit.",
  },
  {
    id: "ci-cd-q7",
    skillId: "ci-cd",
    topicId: "ci-cd-deployment",
    prompt:
      "The deploy job needs a cloud API key. Which approach is appropriate?",
    options: [
      "Store it in the CI platform's encrypted secrets and expose it to the deploy job as an environment variable",
      "Commit it in the pipeline YAML, since the repository is private",
      "Base64-encode it and commit it to the repository",
      "Print it at the start of the job log so teammates can debug with it",
    ],
    answer: 0,
    explanation:
      "CI secret stores encrypt the value, inject it only at runtime and mask it in logs. Anything committed to the repo (base64 is encoding, not encryption) is exposed to everyone with repo access and stays in history.",
  },
  {
    id: "ci-cd-q8",
    skillId: "ci-cd",
    topicId: "ci-cd-deployment",
    prompt:
      "A team wants to release a new version to about 5% of users, watch error rates, and gradually increase the share if everything looks healthy. Which deployment strategy is this?",
    options: ["Blue-green deployment", "Recreate deployment", "Canary deployment", "Big-bang deployment"],
    answer: 2,
    explanation:
      "A canary release exposes a small slice of traffic to the new version and ramps up gradually. Blue-green switches all traffic between two full environments at once.",
  },

  // ---------- docker ----------
  {
    id: "docker-q1",
    skillId: "docker",
    topicId: "docker-images",
    prompt:
      "With this Dockerfile, every source-code change makes the build reinstall all dependencies:\n\nFROM node:20\nWORKDIR /app\nCOPY . .\nRUN npm ci\nCMD [\"node\", \"server.js\"]\n\nWhat is the best fix?",
    options: [
      "Add --no-cache to the docker build command",
      "Copy package.json and package-lock.json first, run npm ci, then COPY the rest of the source",
      "Move the CMD line above RUN npm ci",
      "Switch the base image to ubuntu and install Node manually",
    ],
    answer: 1,
    explanation:
      "Docker reuses a cached layer only if it and all earlier layers are unchanged. Copying just the manifests before npm ci keeps the install layer cached until dependencies actually change.",
  },
  {
    id: "docker-q2",
    skillId: "docker",
    topicId: "docker-images",
    prompt:
      "A Dockerfile ends with:\n\nENTRYPOINT [\"python\", \"app.py\"]\nCMD [\"--port\", \"8000\"]\n\nYou run `docker run myimg --port 9000`. What command runs inside the container?",
    options: [
      "python app.py --port 8000 --port 9000",
      "--port 9000 (and the container fails to start)",
      "python app.py --port 8000",
      "python app.py --port 9000",
    ],
    answer: 3,
    explanation:
      "Arguments given after the image name replace CMD and are appended to ENTRYPOINT, so CMD acts as overridable default arguments.",
  },
  {
    id: "docker-q3",
    skillId: "docker",
    topicId: "docker-containers",
    prompt: "What does `docker run -d -p 8080:80 nginx` do?",
    options: [
      "Runs nginx in the background and forwards port 8080 on the host to port 80 in the container",
      "Runs nginx in the background and forwards port 80 on the host to port 8080 in the container",
      "Runs nginx in the foreground and opens ports 80 through 8080",
      "Builds an nginx image tagged 8080:80",
    ],
    answer: 0,
    explanation:
      "-d detaches the container and -p uses HOST:CONTAINER order, so the site is reachable at localhost:8080.",
  },
  {
    id: "docker-q4",
    skillId: "docker",
    topicId: "docker-containers",
    prompt:
      "You start a container with `docker run -d myapp`. A few seconds later `docker ps` does not list it. What is the most useful next step to find out why?",
    options: [
      "Run `docker exec -it <container> sh` to look around inside it",
      "Run `docker top <container>` to list its processes",
      "Run `docker ps -a` to find the exited container, then `docker logs <container>` to read its output",
      "Run `docker pull myapp` to refresh the image",
    ],
    answer: 2,
    explanation:
      "The container has exited, so it only shows with -a, and its logs usually contain the crash reason. exec and top only work on running containers.",
  },
  {
    id: "docker-q5",
    skillId: "docker",
    topicId: "docker-networking-volumes",
    prompt:
      "A teammate runs PostgreSQL with `docker run -d postgres:16`. After `docker rm -f` and starting a new container, all data is gone. What prevents this?",
    options: [
      "Adding --restart always",
      "Mounting a named volume at the data directory, e.g. -v pgdata:/var/lib/postgresql/data",
      "Publishing the port with -p 5432:5432",
      "Tagging the image with a fixed version",
    ],
    answer: 1,
    explanation:
      "A container's writable layer is deleted with the container. A named volume lives independently, so a new container mounting it sees the same data.",
  },
  {
    id: "docker-q6",
    skillId: "docker",
    topicId: "docker-networking-volumes",
    prompt:
      "Containers named api and db are both attached to a user-defined bridge network called appnet. db listens on 5432. How should api connect to the database?",
    options: [
      "localhost:5432, because both containers are on the same machine",
      "It cannot until db publishes the port with -p 5432:5432",
      "The host machine's public IP on port 5432",
      "db:5432, because Docker's built-in DNS resolves container names on user-defined networks",
    ],
    answer: 3,
    explanation:
      "On a user-defined network containers resolve each other by name and can reach any listening port directly; publishing is only needed for access from outside. localhost inside api refers to the api container itself.",
  },
  {
    id: "docker-q7",
    skillId: "docker",
    topicId: "docker-compose",
    prompt:
      "In a compose file, the web service has:\n\ndepends_on:\n  - db\n\nwith no condition or healthcheck configured. What does this guarantee?",
    options: [
      "The db container is started before web, but not that the database is ready to accept connections",
      "web starts only after the database accepts connections",
      "web is restarted automatically whenever db restarts",
      "web and db share the same filesystem",
    ],
    answer: 0,
    explanation:
      "The short depends_on form controls start order only. Waiting for readiness needs a healthcheck with condition: service_healthy, or retry logic in the app.",
  },
  {
    id: "docker-q8",
    skillId: "docker",
    topicId: "docker-compose",
    prompt:
      "Your compose service uses `build: .`. You change the application code that the Dockerfile copies into the image and run `docker compose up -d`, but the old code is still running. What is the most direct fix?",
    options: [
      "Run `docker compose restart`",
      "Run `docker compose logs -f`",
      "Run `docker compose up -d --build`",
      "Run `docker compose pull`",
    ],
    answer: 2,
    explanation:
      "compose up reuses an existing image unless told to rebuild; --build rebuilds the image and recreates the container. restart reuses the same old image, and pull only fetches images from a registry.",
  },

  // ---------- cloud-fundamentals ----------
  {
    id: "cloud-fundamentals-q1",
    skillId: "cloud-fundamentals",
    topicId: "cloud-fundamentals-models",
    prompt:
      "Your company runs an application on plain virtual machines (IaaS) from a major cloud provider. A critical vulnerability is announced in the VMs' Linux distribution. Under the shared responsibility model, who must patch the guest operating system?",
    options: [
      "The cloud provider, as part of the VM service",
      "The Linux distribution's vendor, remotely",
      "Your company, because the customer manages the guest OS on IaaS",
      "Nobody; VMs are patched automatically on reboot",
    ],
    answer: 2,
    explanation:
      "With IaaS the provider secures the physical infrastructure and hypervisor, while the customer is responsible for the guest OS, applications and data.",
  },
  {
    id: "cloud-fundamentals-q2",
    skillId: "cloud-fundamentals",
    topicId: "cloud-fundamentals-models",
    prompt:
      "A small team wants to push their web application code and have the platform handle servers, OS patching, the language runtime and scaling. Which service model fits best?",
    options: [
      "Infrastructure as a Service (IaaS)",
      "Platform as a Service (PaaS)",
      "Software as a Service (SaaS)",
      "Colocation in a data center",
    ],
    answer: 1,
    explanation:
      "PaaS runs your code on a managed platform so you do not manage servers or the OS. IaaS leaves those to you, and SaaS is finished software you use rather than deploy code to.",
  },
  {
    id: "cloud-fundamentals-q3",
    skillId: "cloud-fundamentals",
    topicId: "cloud-fundamentals-compute-storage",
    prompt:
      "An application must store millions of user-uploaded images and videos, serve them over HTTP, and grow without capacity planning. Which storage type fits best?",
    options: [
      "Object storage (for example Amazon S3)",
      "A block storage volume attached to one VM",
      "The VM's local temporary disk",
      "An in-memory cache",
    ],
    answer: 0,
    explanation:
      "Object storage is built for large numbers of unstructured files with HTTP access and effectively unlimited capacity. Block volumes are sized in advance and normally attached to a single VM.",
  },
  {
    id: "cloud-fundamentals-q4",
    skillId: "cloud-fundamentals",
    topicId: "cloud-fundamentals-compute-storage",
    prompt:
      "You are installing a database on a cloud VM. It needs a low-latency disk with a normal filesystem, and the data must survive if the VM is stopped or replaced. Which option fits?",
    options: [
      "The VM's ephemeral (instance-local) disk",
      "Object storage mounted as the database's data directory",
      "A serverless function's temporary storage",
      "A persistent network-attached block storage volume (for example Amazon EBS)",
    ],
    answer: 3,
    explanation:
      "Persistent block volumes behave like a regular disk and exist independently of the VM lifecycle. Ephemeral disks can lose data when the VM stops, and object storage is not suited to database file I/O.",
  },
  {
    id: "cloud-fundamentals-q5",
    skillId: "cloud-fundamentals",
    topicId: "cloud-fundamentals-iam",
    prompt:
      "An application running on a cloud VM only needs to read files from one storage bucket. Which setup follows the principle of least privilege?",
    options: [
      "Create an admin user and put its access keys in the application's config file",
      "Use the account's root credentials so permissions never block the app",
      "Attach a role to the VM that grants read-only access to that one bucket",
      "Make the bucket public so no credentials are needed",
    ],
    answer: 2,
    explanation:
      "A role scoped to read-only on one bucket grants exactly what is needed and provides temporary credentials automatically, with no long-lived keys to leak.",
  },
  {
    id: "cloud-fundamentals-q6",
    skillId: "cloud-fundamentals",
    topicId: "cloud-fundamentals-iam",
    prompt:
      "In AWS IAM, a user has one policy that allows all S3 actions (s3:*) and another policy that explicitly denies s3:DeleteObject. The user tries to delete an object. What happens?",
    options: [
      "The request is denied, because an explicit deny always overrides an allow",
      "The request is allowed, because the allow is broader",
      "The request is allowed, because the most recently attached policy wins",
      "The result is random until the conflict is resolved",
    ],
    answer: 0,
    explanation:
      "IAM evaluates all applicable policies together and any explicit deny wins over any allow.",
  },
  {
    id: "cloud-fundamentals-q7",
    skillId: "cloud-fundamentals",
    topicId: "cloud-fundamentals-scaling-cost",
    prompt:
      "A web application runs on a single VM in one availability zone. The business wants it to stay up even if that data center has an outage. What is the most appropriate change?",
    options: [
      "Move the app to a much larger VM in the same zone",
      "Run instances in at least two availability zones behind a load balancer",
      "Take daily snapshots of the VM",
      "Add a second network interface to the VM",
    ],
    answer: 1,
    explanation:
      "Availability zones are isolated failure domains, so spreading instances across zones behind a load balancer keeps serving traffic if one zone fails. A bigger VM or snapshots do not remove the single point of failure.",
  },
  {
    id: "cloud-fundamentals-q8",
    skillId: "cloud-fundamentals",
    topicId: "cloud-fundamentals-scaling-cost",
    prompt:
      "A team's development VMs run 24/7 but are only used on weekdays from 9 to 6. Billing is per second of running compute. What is the most direct way to cut the bill?",
    options: [
      "Upgrade to larger VMs so work finishes faster",
      "Spread the VMs across more availability zones",
      "Move the VMs to a region closer to the developers",
      "Automatically stop the VMs outside working hours and start them again in the morning",
    ],
    answer: 3,
    explanation:
      "With pay-as-you-go compute you pay for running time, so stopping idle VMs removes roughly 70% of the compute hours. The other options increase or do not affect cost.",
  },

  // ---------- networking ----------
  {
    id: "networking-q1",
    skillId: "networking",
    topicId: "networking-ip-ports",
    prompt:
      "In a traditional IPv4 network, how many usable host addresses does the subnet 10.0.1.0/24 provide?",
    options: ["24", "256", "254", "512"],
    answer: 2,
    explanation:
      "A /24 leaves 8 host bits, giving 256 addresses; the network address and the broadcast address are reserved, leaving 254 for hosts.",
  },
  {
    id: "networking-q2",
    skillId: "networking",
    topicId: "networking-ip-ports",
    prompt:
      "On a database server, `ss -tlnp` shows PostgreSQL listening on 127.0.0.1:5432. The firewall allows port 5432, but other machines get connection errors. What is the most likely cause?",
    options: [
      "The service is bound only to the loopback interface, so it accepts connections only from the server itself",
      "Port 5432 is reserved and cannot be used over a network",
      "PostgreSQL uses UDP, which the firewall rule does not cover",
      "DNS has no record for 127.0.0.1",
    ],
    answer: 0,
    explanation:
      "127.0.0.1 is reachable only from the local machine. The service must listen on 0.0.0.0 or the server's network IP to accept remote connections.",
  },
  {
    id: "networking-q3",
    skillId: "networking",
    topicId: "networking-dns",
    prompt:
      "Your hosting platform tells you to point www.example.com at the hostname myapp.hosting.net (not at an IP address). Which DNS record type do you create?",
    options: ["A", "MX", "TXT", "CNAME"],
    answer: 3,
    explanation:
      "A CNAME aliases one hostname to another. An A record maps a name to an IPv4 address, MX is for mail routing and TXT holds arbitrary text.",
  },
  {
    id: "networking-q4",
    skillId: "networking",
    topicId: "networking-dns",
    prompt:
      "You update an A record to a new server IP. The record's TTL was 3600. For the next hour some users still reach the old server while others reach the new one. Why?",
    options: [
      "The DNS change failed and must be re-applied",
      "Resolvers that cached the old answer keep serving it until the TTL expires",
      "Browsers ignore DNS for sites they have visited before",
      "A records only take effect at midnight UTC",
    ],
    answer: 1,
    explanation:
      "Recursive resolvers cache answers for the TTL, so old and new answers coexist until caches expire. Lowering the TTL ahead of a planned change shortens this window.",
  },
  {
    id: "networking-q5",
    skillId: "networking",
    topicId: "networking-http-tls",
    prompt:
      "Users get \"502 Bad Gateway\" from a site where nginx acts as a reverse proxy in front of an application server. Where should you look first?",
    options: [
      "The user's browser cache",
      "The site's DNS records",
      "The upstream application: is it running, and is nginx pointing at the right host and port?",
      "The user's login credentials",
    ],
    answer: 2,
    explanation:
      "A 502 means the proxy itself is reachable but got no valid response from the upstream server, which usually means the app is down, crashing, or the upstream address is wrong.",
  },
  {
    id: "networking-q6",
    skillId: "networking",
    topicId: "networking-http-tls",
    prompt:
      "A browser shows a certificate name-mismatch error for https://api.example.com. The server presents a valid, unexpired certificate issued only for www.example.com. What is the cause?",
    options: [
      "api.example.com is not listed in the certificate's subject alternative names",
      "The server is using port 443 instead of port 80",
      "The certificate authority is offline",
      "TLS certificates cannot be used for subdomains",
    ],
    answer: 0,
    explanation:
      "The client checks that the hostname it requested appears in the certificate. A certificate for www.example.com does not cover api.example.com unless that name or a matching wildcard is included.",
  },
  {
    id: "networking-q7",
    skillId: "networking",
    topicId: "networking-load-balancing-troubleshooting",
    prompt:
      "A load balancer distributes traffic across three backend servers and runs health checks against /health. One server starts failing its health checks. What does the load balancer do?",
    options: [
      "Stops sending traffic to all three servers until an operator intervenes",
      "Keeps sending it one third of the traffic",
      "Reboots the failing server",
      "Stops routing new requests to the failing server and spreads traffic across the two healthy ones",
    ],
    answer: 3,
    explanation:
      "Health checks exist so unhealthy targets are taken out of rotation automatically and return once they pass again.",
  },
  {
    id: "networking-q8",
    skillId: "networking",
    topicId: "networking-load-balancing-troubleshooting",
    prompt:
      "`curl http://10.0.2.15:8080` fails instantly with \"Connection refused\". What is the most likely explanation?",
    options: [
      "DNS could not resolve the hostname",
      "The host is reachable, but no process is listening on port 8080",
      "A firewall is silently dropping the packets",
      "The server's TLS certificate has expired",
    ],
    answer: 1,
    explanation:
      "An immediate refusal means the host answered with a TCP reset because nothing accepts connections on that port. Silently dropped packets show up as a timeout, and no DNS or TLS is involved for a plain HTTP request to an IP.",
  },

  // ---------- iac ----------
  {
    id: "iac-q1",
    skillId: "iac",
    topicId: "iac-concepts",
    prompt:
      "A Terraform configuration declares three identical servers. All three already exist, were created by this configuration, and match it exactly. You run `terraform apply` again. What happens?",
    options: [
      "Three more servers are created, for a total of six",
      "Terraform reports no changes and creates nothing",
      "The three servers are destroyed and recreated",
      "The command fails because the resources already exist",
    ],
    answer: 1,
    explanation:
      "Declarative tools converge real infrastructure to the described end state, so applying an already-satisfied configuration is a no-op (idempotency).",
  },
  {
    id: "iac-q2",
    skillId: "iac",
    topicId: "iac-concepts",
    prompt:
      "A firewall rule is managed by Terraform. During an incident someone opens an extra port by hand in the cloud console and does not update the code. What will the next `terraform plan` show?",
    options: [
      "Nothing, because Terraform only looks at its code",
      "An error that stops all further use until the state is deleted",
      "A proposal to update the code file to include the new port",
      "The drift: a proposed change that reverts the rule to what the code declares",
    ],
    answer: 3,
    explanation:
      "plan refreshes the real resource, notices it no longer matches the configuration, and proposes changing it back. Terraform never edits your code, which is why manual changes must be made in code to persist.",
  },
  {
    id: "iac-q3",
    skillId: "iac",
    topicId: "iac-workflow",
    prompt:
      "You clone a Terraform repository onto a new laptop and run `terraform plan`. It fails, saying the required providers are not installed. What do you run first?",
    options: ["terraform init", "terraform apply", "terraform fmt", "terraform destroy"],
    answer: 0,
    explanation:
      "init downloads the providers and modules and configures the backend; it must be run in a working directory before plan or apply.",
  },
  {
    id: "iac-q4",
    skillId: "iac",
    topicId: "iac-workflow",
    prompt:
      "`terraform plan` marks a database instance with `-/+` and the note \"must be replaced\", and the summary reads \"Plan: 1 to add, 0 to change, 1 to destroy\". What will apply do?",
    options: [
      "Update the database in place with no interruption",
      "Add a second database and keep the existing one",
      "Destroy the existing database and create a new one, risking downtime and data loss",
      "Nothing; it only records the change in the state file",
    ],
    answer: 2,
    explanation:
      "-/+ means the change cannot be made in place, so the resource is destroyed and recreated. Reading the plan carefully before applying is how you catch destructive changes like this.",
  },
  {
    id: "iac-q5",
    skillId: "iac",
    topicId: "iac-state",
    prompt:
      "Three engineers apply the same Terraform configuration, each with their own local terraform.tfstate file. They keep overwriting or duplicating each other's resources. What is the standard fix?",
    options: [
      "Email the state file to the team after every apply",
      "Store state in a shared remote backend with state locking",
      "Add terraform.tfstate to .gitignore and keep working locally",
      "Run apply with a higher parallelism setting",
    ],
    answer: 1,
    explanation:
      "A remote backend gives everyone a single source of truth, and locking prevents two applies from running at the same time and corrupting state.",
  },
  {
    id: "iac-q6",
    skillId: "iac",
    topicId: "iac-state",
    prompt:
      "A teammate deletes the only copy of the Terraform state file. The cloud resources still exist. They then run `terraform apply`. What does Terraform do?",
    options: [
      "Detects the existing resources automatically and reports no changes",
      "Deletes all the existing resources to match the empty state",
      "Rebuilds the state file from the cloud provider's audit logs",
      "Treats every resource as new and tries to create them all again, causing duplicates or name-conflict errors",
    ],
    answer: 3,
    explanation:
      "State is how Terraform maps configuration to real resources. Without it Terraform believes nothing exists; existing resources would have to be re-imported into state.",
  },
  {
    id: "iac-q7",
    skillId: "iac",
    topicId: "iac-modules-variables",
    prompt:
      "The dev and prod environments should use the same Terraform code, but dev uses small instances and prod uses large ones. What is the cleanest approach?",
    options: [
      "Declare an input variable for the instance size and supply different values per environment, for example with separate .tfvars files",
      "Copy the whole codebase into dev and prod folders and edit the sizes by hand",
      "Hard-code the prod size and resize the dev instances manually in the console",
      "Comment and uncomment the relevant lines before each apply",
    ],
    answer: 0,
    explanation:
      "Input variables keep one codebase and make the environment differences explicit and reviewable. Copies drift apart, and manual console edits get reverted by the next apply.",
  },
  {
    id: "iac-q8",
    skillId: "iac",
    topicId: "iac-modules-variables",
    prompt:
      "Three project repositories each contain the same 80 lines of copy-pasted Terraform defining a network, and the copies have started to differ. What is the idiomatic fix?",
    options: [
      "Merge all three projects into one giant configuration file",
      "Create the networks manually and stop managing them with Terraform",
      "Extract the network into a reusable module with input variables and call it from each project",
      "Add a comment in each copy reminding people to keep them in sync",
    ],
    answer: 2,
    explanation:
      "Modules package a group of resources behind inputs and outputs so they are defined once, versioned, and reused consistently.",
  },

  // ---------- monitoring ----------
  {
    id: "monitoring-q1",
    skillId: "monitoring",
    topicId: "monitoring-signals",
    prompt:
      "A checkout request passes through six microservices and sometimes takes 4 seconds. Which telemetry signal most directly shows which service the time was spent in?",
    options: [
      "Host CPU metrics",
      "Application error logs",
      "Distributed traces",
      "Uptime checks",
    ],
    answer: 2,
    explanation:
      "A trace follows one request across services and records the duration of each span, so the slow hop is immediately visible.",
  },
  {
    id: "monitoring-q2",
    skillId: "monitoring",
    topicId: "monitoring-signals",
    prompt:
      "Your team switches from free-text log lines to structured JSON logs that include a request_id field on every line. What is the main practical benefit?",
    options: [
      "You can filter and correlate every log line belonging to one request, even across services",
      "Logs no longer need any storage",
      "The application uses less CPU",
      "Metrics and dashboards are no longer needed",
    ],
    answer: 0,
    explanation:
      "Structured fields are machine-queryable, and a shared request ID lets you reconstruct what happened to a single request across components.",
  },
  {
    id: "monitoring-q3",
    skillId: "monitoring",
    topicId: "monitoring-metrics-dashboards",
    prompt:
      "The dashboard shows average API latency at a steady 120 ms, yet a noticeable number of users report multi-second responses. Which metric should you look at next?",
    options: [
      "Average latency over a longer time window",
      "Total requests per day",
      "Server uptime",
      "p95/p99 latency percentiles",
    ],
    answer: 3,
    explanation:
      "Averages hide the slow tail: a small share of very slow requests barely moves the mean but shows clearly in high percentiles.",
  },
  {
    id: "monitoring-q4",
    skillId: "monitoring",
    topicId: "monitoring-metrics-dashboards",
    prompt:
      "A worker service shows CPU at 95% and a steadily growing job queue. Which of the four golden signals (latency, traffic, errors, saturation) does this most directly describe?",
    options: ["Traffic", "Saturation", "Errors", "Latency"],
    answer: 1,
    explanation:
      "Saturation measures how full a resource is; near-maxed CPU and a growing queue mean the service is at capacity.",
  },
  {
    id: "monitoring-q5",
    skillId: "monitoring",
    topicId: "monitoring-alerting",
    prompt:
      "An alert pages the on-call engineer whenever CPU exceeds 80% for 10 seconds. It fires about 50 times a day, resolves on its own, and nobody ever takes action. What is the best improvement?",
    options: [
      "Send the same alert to more people",
      "Lower the threshold to 70% to get earlier warning",
      "Page on sustained user-facing symptoms such as error rate or latency, and require the condition to hold for several minutes",
      "Keep the alert and have on-call acknowledge it faster",
    ],
    answer: 2,
    explanation:
      "Pages should be actionable and tied to user impact. Noisy cause-based alerts create alert fatigue, which makes people miss the real incidents.",
  },
  {
    id: "monitoring-q6",
    skillId: "monitoring",
    topicId: "monitoring-alerting",
    prompt:
      "A service has an availability SLO of 99.9% over a 30-day window. Roughly how much total downtime does the error budget allow in that window?",
    options: ["About 43 minutes", "About 4 minutes", "About 7 hours", "About 3 days"],
    answer: 0,
    explanation:
      "30 days is 43,200 minutes, and 0.1% of that is about 43 minutes.",
  },
  {
    id: "monitoring-q7",
    skillId: "monitoring",
    topicId: "monitoring-incidents",
    prompt:
      "At 14:05 the error rate of a previously stable service jumps from 0.1% to 20%. What is usually the most productive first check?",
    options: [
      "Rewrite the slowest endpoint",
      "Add more dashboards",
      "Wait an hour to see whether it recovers on its own",
      "Look for a deploy or config change just before 14:05 and roll it back if it correlates",
    ],
    answer: 3,
    explanation:
      "Most sudden regressions are caused by a recent change, and rolling back mitigates user impact quickly while the root cause is investigated afterwards.",
  },
  {
    id: "monitoring-q8",
    skillId: "monitoring",
    topicId: "monitoring-incidents",
    prompt:
      "An outage was triggered when an engineer ran a migration against production by mistake. Which post-incident review approach is most effective?",
    options: [
      "Identify the engineer responsible and issue a formal warning",
      "A blameless review focused on how the system allowed the mistake, ending with concrete action items",
      "Skip the review because the issue is already fixed",
      "Restrict all production access to a single person",
    ],
    answer: 1,
    explanation:
      "Blameless postmortems get honest details and lead to systemic fixes such as guardrails and safer tooling, which prevent the same mistake by anyone else.",
  },
];

export const plans: SkillPlan[] = [
  {
    skillId: "linux",
    days: [
      {
        topicId: "linux-filesystem",
        title: "Find your way around a Linux server",
        minutes: 60,
        summary: "Learn the standard directory layout and the commands for moving around and inspecting files and disk usage.",
        learn: [
          "The filesystem hierarchy: what lives in /etc, /var, /home, /usr, /tmp and /opt",
          "Navigation and inspection: pwd, cd, ls -la, cat, less, head, tail -f",
          "Finding things: find by name/size/age, and which/whereis for binaries",
          "Disk usage: df -h for filesystems versus du -sh for directories",
        ],
        practice:
          "In a Linux VM, WSL or container, locate the three largest directories under /var, find every .conf file under /etc modified in the last 7 days, and follow a log file live with tail -f.",
      },
      {
        topicId: "linux-permissions",
        title: "Permissions, users and sudo",
        minutes: 60,
        summary: "Read and change file permissions and ownership with confidence.",
        learn: [
          "Reading ls -l output: owner, group, others and the r/w/x bits for files versus directories",
          "chmod in octal (644, 755, 600) and symbolic (u+x, go-w) forms",
          "chown and chgrp, users and groups, and how to inspect them with id and groups",
          "sudo and why you avoid logging in as root or using chmod 777",
        ],
        practice:
          "Create a user and a group, make a shared directory that only group members can write to, create a script that fails with Permission denied, then fix it with the minimum permission change.",
      },
      {
        topicId: "linux-processes",
        title: "Processes and services",
        minutes: 75,
        summary: "Inspect, stop and manage running processes and systemd services.",
        learn: [
          "Listing and inspecting processes: ps aux, top or htop, pgrep",
          "Signals: SIGTERM versus SIGKILL, kill and pkill, foreground and background jobs",
          "systemd basics: systemctl start, stop, status, enable, disable",
          "Reading service logs with journalctl -u and following them with -f",
        ],
        practice:
          "Write a small systemd unit that runs a simple script or python3 -m http.server, start it, enable it at boot, kill the process and observe what systemd does, then read its logs with journalctl.",
      },
      {
        topicId: "linux-scripting",
        title: "Shell scripting and text processing",
        minutes: 90,
        summary: "Chain commands with pipes and write small, safe Bash scripts.",
        learn: [
          "Pipes and redirection: |, >, >>, 2>&1, and exit codes with $?",
          "Text tools: grep, awk for fields, cut, sort, uniq -c, wc",
          "Bash basics: variables, quoting, if, for loops, and script arguments",
          "Safer scripts with set -euo pipefail and meaningful exit codes",
        ],
        practice:
          "Using a sample web access log, write a script that prints the top 10 client IPs, the count of each HTTP status code, and exits non-zero if more than 5% of requests are 5xx.",
      },
      {
        topicId: null,
        title: "Challenge: server health report",
        minutes: 120,
        summary: "Combine navigation, permissions, services and scripting into one useful automation.",
        learn: [
          "Scheduling recurring jobs with cron or a systemd timer",
          "Writing script output to a dated log file with appropriate permissions",
          "Checking a service's state from a script using systemctl is-active",
        ],
        practice:
          "Write health.sh that reports disk usage above 80%, the top 5 memory-consuming processes, whether a chosen service is active, and the last 10 error lines from its logs; save the report to a dated file readable only by you and schedule it to run hourly.",
      },
    ],
  },
  {
    skillId: "ci-cd",
    days: [
      {
        topicId: "ci-cd-concepts",
        title: "What CI/CD is and why teams use it",
        minutes: 45,
        summary: "Understand continuous integration, delivery and deployment and the problems they solve.",
        learn: [
          "Continuous integration: small frequent merges verified by automated build and tests",
          "Continuous delivery versus continuous deployment and where the manual gate sits",
          "The typical pipeline flow: commit, build, test, package, deploy",
          "Why fast feedback and a green main branch matter",
        ],
        practice:
          "Pick a well-known open-source repository, open its CI configuration, and write down each stage it runs, what triggers it, and whether it practises delivery or deployment.",
      },
      {
        topicId: "ci-cd-pipeline-config",
        title: "Write your first pipeline",
        minutes: 90,
        summary: "Configure triggers, jobs and dependencies in a YAML pipeline.",
        learn: [
          "Pipeline anatomy: workflows, jobs, steps and runners",
          "Triggers: push, pull request, branch filters, manual and scheduled runs",
          "Job ordering: parallel by default, dependencies with needs, conditions",
          "Environment variables and reading pipeline logs when a step fails",
        ],
        practice:
          "In a small repository of your own, create a GitHub Actions workflow that runs on pull requests and on pushes to main, with a lint job and a test job, and a final job that runs only if both pass.",
      },
      {
        topicId: "ci-cd-testing-artifacts",
        title: "Tests, caching and artifacts",
        minutes: 75,
        summary: "Make the pipeline fast and trustworthy with ordered checks, caches and build outputs.",
        learn: [
          "Fail fast: ordering lint, unit, integration and end-to-end tests by cost",
          "Dependency caching and choosing a cache key from the lockfile",
          "Build artifacts: build once and promote the same artifact through stages",
          "Dealing with flaky tests instead of re-running until green",
        ],
        practice:
          "Add dependency caching keyed on your lockfile to yesterday's workflow, upload the build output as an artifact, and compare pipeline duration before and after.",
      },
      {
        topicId: "ci-cd-deployment",
        title: "Deploying safely",
        minutes: 75,
        summary: "Learn how pipelines ship to environments, protect secrets and roll back.",
        learn: [
          "Environments and promotion: dev, staging, production and approval gates",
          "Secrets management: encrypted CI secrets, masking, never committing credentials",
          "Deployment strategies: rolling, blue-green and canary, and their trade-offs",
          "Rollback plans and post-deploy smoke checks",
        ],
        practice:
          "Add a deploy job that runs only on main, reads a token from the CI secrets store, deploys to a free static or container host, and then runs a smoke check with curl.",
      },
      {
        topicId: null,
        title: "Challenge: end-to-end pipeline",
        minutes: 120,
        summary: "Build a complete pipeline from pull request to a verified deployment.",
        learn: [
          "Branch protection rules that require passing checks before merge",
          "Status badges and making pipeline health visible",
          "Recording which commit is deployed for traceability",
        ],
        practice:
          "For a small web app, build a pipeline that lints and tests on every PR, blocks merging on failure, builds an artifact on main, deploys it with secrets from the CI store, smoke-tests the live URL, and document how you would roll back.",
      },
    ],
  },
  {
    skillId: "docker",
    days: [
      {
        topicId: "docker-images",
        title: "Images and Dockerfiles",
        minutes: 75,
        summary: "Understand image layers and write an efficient Dockerfile.",
        learn: [
          "Images versus containers, tags, and registries",
          "Dockerfile instructions: FROM, WORKDIR, COPY, RUN, ENV, EXPOSE, CMD, ENTRYPOINT",
          "Layer caching and ordering instructions so dependency installs stay cached",
          "Smaller images: slim base images, .dockerignore, multi-stage builds",
        ],
        practice:
          "Containerise a small web app you have written, then reorder the Dockerfile and add a .dockerignore so that a code-only change rebuilds in seconds; compare image size before and after using a slim base.",
      },
      {
        topicId: "docker-containers",
        title: "Running and debugging containers",
        minutes: 60,
        summary: "Run containers with the right flags and figure out why one is misbehaving.",
        learn: [
          "docker run flags: -d, -p HOST:CONTAINER, -e, --name, --rm",
          "Lifecycle: ps, ps -a, stop, start, rm, and exit codes",
          "Debugging: logs, exec -it, inspect, and why exec fails on stopped containers",
          "Restart policies and resource limits",
        ],
        practice:
          "Run your image with a deliberately wrong environment variable so it crashes, diagnose it using only docker ps -a and docker logs, fix it, then open a shell inside the running container to confirm the config.",
      },
      {
        topicId: "docker-networking-volumes",
        title: "Networking and persistent data",
        minutes: 75,
        summary: "Connect containers to each other and keep data beyond a container's life.",
        learn: [
          "User-defined bridge networks and name-based discovery between containers",
          "Publishing ports versus container-to-container traffic",
          "Named volumes versus bind mounts and when to use each",
          "Why a container's writable layer is disposable",
        ],
        practice:
          "Create a network, run PostgreSQL on it with a named volume, connect from a second container using the database container's name, insert a row, delete and recreate the database container, and verify the row survived.",
      },
      {
        topicId: "docker-compose",
        title: "Multi-container apps with Compose",
        minutes: 90,
        summary: "Describe a whole application stack in one compose file.",
        learn: [
          "Compose file structure: services, build versus image, ports, environment, volumes",
          "depends_on, healthchecks and the difference between started and ready",
          "Everyday commands: up -d, up --build, down, logs -f, ps, exec",
          "Using an .env file for configuration and keeping secrets out of the repo",
        ],
        practice:
          "Write a compose file with your web app, a database with a named volume and a healthcheck, and make the app wait until the database is healthy; bring it up, change the code, and rebuild with one command.",
      },
      {
        topicId: null,
        title: "Challenge: ship a containerised stack",
        minutes: 120,
        summary: "Package a full application so a teammate can run it with a single command.",
        learn: [
          "Running as a non-root user inside the container",
          "Tagging images with versions instead of relying on latest",
          "Pushing an image to a container registry",
        ],
        practice:
          "Build a three-service stack (app, database, cache or reverse proxy) with a multi-stage Dockerfile, non-root user, healthchecks and persistent data; push the app image with a version tag and write the exact commands a teammate needs to start it from scratch.",
      },
    ],
  },
  {
    skillId: "cloud-fundamentals",
    days: [
      {
        topicId: "cloud-fundamentals-models",
        title: "Cloud models and who is responsible for what",
        minutes: 45,
        summary: "Understand IaaS, PaaS, SaaS and the shared responsibility model.",
        learn: [
          "IaaS, PaaS, SaaS and serverless, with an example of each",
          "The shared responsibility model: provider secures the cloud, customer secures what is in it",
          "Regions and availability zones as the basic geography of a cloud",
          "Pay-as-you-go pricing versus buying hardware up front",
        ],
        practice:
          "For five services you know (for example a VM service, a managed database, object storage, a functions platform, a hosted email tool), classify the service model and list what the customer is still responsible for.",
      },
      {
        topicId: "cloud-fundamentals-compute-storage",
        title: "Compute and storage choices",
        minutes: 90,
        summary: "Pick the right compute and storage type for a workload.",
        learn: [
          "Compute options: virtual machines, containers, serverless functions and their trade-offs",
          "Object, block and file storage and typical use cases for each",
          "Ephemeral versus persistent disks and what happens when a VM stops",
          "Managed databases versus running your own on a VM",
        ],
        practice:
          "Using a cloud free tier, launch a small VM, SSH in and serve a web page, then create an object storage bucket and upload and download a file from the command line; delete everything afterwards.",
      },
      {
        topicId: "cloud-fundamentals-iam",
        title: "Identity and access management",
        minutes: 75,
        summary: "Grant exactly the access that is needed and no more.",
        learn: [
          "Users, groups, roles and policies, and how they relate",
          "Least privilege, and why explicit deny overrides allow",
          "Roles for workloads instead of long-lived access keys in code",
          "Protecting the root account and enabling multi-factor authentication",
        ],
        practice:
          "Write a policy that allows read-only access to a single bucket, attach it to a role used by your VM, and prove from the VM that reading works while writing and listing other buckets are denied.",
      },
      {
        topicId: "cloud-fundamentals-scaling-cost",
        title: "Availability, scaling and cost",
        minutes: 60,
        summary: "Design for failure and keep the bill under control.",
        learn: [
          "High availability across availability zones with a load balancer",
          "Vertical versus horizontal scaling and auto scaling on a metric",
          "Cost drivers: running compute, storage, and data transfer out",
          "Cost controls: budgets and alerts, tagging, rightsizing, stopping idle resources",
        ],
        practice:
          "Set a budget alert on your account, then sketch an architecture for a web app that survives a zone outage and use the provider's pricing calculator to estimate its monthly cost.",
      },
      {
        topicId: null,
        title: "Challenge: a small, secure, highly available design",
        minutes: 120,
        summary: "Combine service selection, IAM, availability and cost into one reviewed design.",
        learn: [
          "Reading an architecture diagram and spotting single points of failure",
          "Public versus private subnets at a conceptual level",
          "Writing a teardown checklist so nothing keeps billing",
        ],
        practice:
          "Design and, where the free tier allows, build a photo-sharing backend: app on compute in two zones behind a load balancer, images in object storage accessed through a least-privilege role, with a cost estimate, a budget alert and a teardown checklist.",
      },
    ],
  },
  {
    skillId: "networking",
    days: [
      {
        topicId: "networking-ip-ports",
        title: "IP addresses, subnets and ports",
        minutes: 60,
        summary: "Understand how machines and services are addressed on a network.",
        learn: [
          "IPv4 addresses, CIDR notation and working out a subnet's size",
          "Private ranges (10/8, 172.16/12, 192.168/16), public IPs and NAT",
          "TCP versus UDP and well-known ports such as 22, 53, 80, 443, 5432",
          "Listening addresses: 127.0.0.1 versus 0.0.0.0, inspected with ss -tlnp",
        ],
        practice:
          "On your machine, list all listening ports with ss or netstat and identify each process; start a server bound to 127.0.0.1, try reaching it from another device, then rebind it to 0.0.0.0 and try again.",
      },
      {
        topicId: "networking-dns",
        title: "How DNS works",
        minutes: 60,
        summary: "Follow a name lookup from the browser to the authoritative server.",
        learn: [
          "The resolution path: stub resolver, recursive resolver, root, TLD, authoritative",
          "Record types: A, AAAA, CNAME, MX, TXT, NS",
          "TTL and caching, and why DNS changes appear to propagate slowly",
          "Tools: dig, nslookup, and the local hosts file",
        ],
        practice:
          "Use dig to look up the A, CNAME, MX and NS records of three popular sites, note the TTLs, run dig +trace on one, and explain each hop in your own words.",
      },
      {
        topicId: "networking-http-tls",
        title: "HTTP and TLS",
        minutes: 75,
        summary: "Read HTTP requests and responses and understand what HTTPS adds.",
        learn: [
          "Request and response anatomy: methods, headers, body, and status code classes",
          "Gateway errors: what 502, 503 and 504 tell you when a proxy is involved",
          "TLS basics: certificates, certificate authorities, hostname validation and expiry",
          "Inspecting traffic with curl -v and the browser network tab",
        ],
        practice:
          "Use curl -v against an HTTPS site to identify the status code, response headers and certificate subject and expiry, then trigger and explain a 301, a 404 and a certificate name mismatch (for example by requesting a site by its IP).",
      },
      {
        topicId: "networking-load-balancing-troubleshooting",
        title: "Load balancing and troubleshooting",
        minutes: 90,
        summary: "Understand how traffic is spread across servers and debug connectivity step by step.",
        learn: [
          "Load balancer basics: algorithms, health checks, layer 4 versus layer 7",
          "Reverse proxies and how they relate to load balancers",
          "Reading failures: could not resolve host versus connection refused versus timed out",
          "A layered method: DNS, then reachability (ping, traceroute), then port (nc, ss), then application (curl, logs)",
        ],
        practice:
          "Run two copies of a simple web server on different ports, put nginx in front as a load balancer, watch requests alternate, stop one backend and observe the behaviour, then reproduce and label a refused connection and a timeout.",
      },
      {
        topicId: null,
        title: "Challenge: diagnose a broken site",
        minutes: 120,
        summary: "Apply a systematic method to find several faults in one setup.",
        learn: [
          "Writing down hypotheses and evidence while troubleshooting",
          "Firewall and security-group rules as a common cause of timeouts",
          "Communicating a diagnosis clearly to a teammate",
        ],
        practice:
          "Ask a friend (or script it yourself) to break your nginx-plus-backends setup in three ways, such as a wrong hosts entry, a backend bound to loopback, and a wrong upstream port; find each fault using dig, ss, nc and curl, and write a short report of symptom, evidence and fix for each.",
      },
    ],
  },
  {
    skillId: "iac",
    days: [
      {
        topicId: "iac-concepts",
        title: "Why infrastructure as code",
        minutes: 45,
        summary: "Understand declarative configuration, idempotency and drift.",
        learn: [
          "Problems with manual, click-through infrastructure: no history, no review, no repeatability",
          "Declarative versus imperative approaches",
          "Idempotency: applying the same configuration twice changes nothing",
          "Configuration drift and why changes belong in code and version control",
        ],
        practice:
          "Write the manual steps to create a VM with a firewall rule, then express the same thing as declarative pseudo-configuration and list what the declarative version gives you that the steps do not.",
      },
      {
        topicId: "iac-workflow",
        title: "The init, plan, apply workflow",
        minutes: 90,
        summary: "Create, change and destroy real resources with Terraform-style commands.",
        learn: [
          "Providers, resources and data sources",
          "terraform init, fmt, validate, plan, apply and destroy",
          "Reading a plan: the +, ~, - and -/+ symbols and the summary line",
          "Why you review the plan before applying, especially for replacements",
        ],
        practice:
          "Install Terraform, use the local or docker provider (no cloud account needed) to create a resource, change an attribute and compare a plan that updates in place with one that forces replacement, then destroy everything.",
      },
      {
        topicId: "iac-state",
        title: "State",
        minutes: 75,
        summary: "Learn what the state file is and how teams share it safely.",
        learn: [
          "What state stores and how it maps configuration to real resources",
          "Remote backends and state locking for teams",
          "Why state can contain secrets and should not be committed to Git",
          "Inspecting and repairing: state list, state show, and importing existing resources",
        ],
        practice:
          "Inspect your project's state with terraform state list and show, change a managed resource by hand and observe the drift in plan, then back up and remove the state file and see what plan proposes.",
      },
      {
        topicId: "iac-modules-variables",
        title: "Variables, outputs and modules",
        minutes: 90,
        summary: "Make infrastructure code reusable across environments.",
        learn: [
          "Input variables with types, defaults and validation; outputs and locals",
          "Supplying values with .tfvars files and environment variables",
          "Writing and calling a module with inputs and outputs",
          "Patterns for separating dev and prod while sharing code",
        ],
        practice:
          "Refactor your configuration into a module with variables for name and size, call it from a root configuration, and apply it twice using dev.tfvars and prod.tfvars with different values.",
      },
      {
        topicId: null,
        title: "Challenge: reusable environment from code",
        minutes: 120,
        summary: "Build a small, reviewable, repeatable environment entirely from code.",
        learn: [
          "Structuring a repository: modules folder, environment folders, README",
          "Running fmt, validate and plan in CI on pull requests",
          "Marking outputs as sensitive",
        ],
        practice:
          "Create a Git repository with a module that provisions a web container plus a network (docker provider) or a VM plus a firewall rule (cloud free tier), instantiate it for dev and prod from variables, keep state out of Git, and add a CI job that runs fmt -check, validate and plan.",
      },
    ],
  },
  {
    skillId: "monitoring",
    days: [
      {
        topicId: "monitoring-signals",
        title: "Metrics, logs and traces",
        minutes: 45,
        summary: "Know what each telemetry signal is good for and when to reach for it.",
        learn: [
          "Monitoring versus observability",
          "Metrics for trends and alerting, logs for detail, traces for request flow",
          "Structured logging, log levels and correlation or request IDs",
          "The cost and cardinality trade-offs of each signal",
        ],
        practice:
          "Take a small web app of yours and convert its logging to structured JSON with a level, timestamp and per-request ID, then use grep or jq to pull out every line belonging to one request.",
      },
      {
        topicId: "monitoring-metrics-dashboards",
        title: "Metrics that matter and dashboards",
        minutes: 90,
        summary: "Instrument a service and build a dashboard that answers whether it is healthy.",
        learn: [
          "The four golden signals: latency, traffic, errors, saturation",
          "Counters, gauges and histograms, and rates over time",
          "Why percentiles (p50, p95, p99) beat averages for latency",
          "Dashboard design: a few high-level panels first, details below",
        ],
        practice:
          "Run Prometheus and Grafana with Docker Compose, expose request count and latency histogram metrics from a sample app, and build a dashboard showing request rate, error rate and p95 latency.",
      },
      {
        topicId: "monitoring-alerting",
        title: "Alerting and SLOs",
        minutes: 75,
        summary: "Define reliability targets and alerts that people will actually act on.",
        learn: [
          "SLIs, SLOs and error budgets, including how to compute allowed downtime",
          "Alerting on symptoms that users feel rather than every possible cause",
          "Reducing noise: duration windows, severities, pages versus tickets",
          "What a good alert contains: impact, a dashboard link, and a runbook",
        ],
        practice:
          "Define an availability SLI and a 99.5% SLO for your sample app, calculate the monthly error budget in minutes, and write an alert rule that fires only when the error rate stays above 5% for 5 minutes.",
      },
      {
        topicId: "monitoring-incidents",
        title: "Incident response and debugging",
        minutes: 75,
        summary: "Work through an incident methodically from alert to postmortem.",
        learn: [
          "Mitigate first: roll back or fail over before hunting the root cause",
          "Correlating the start of a problem with deploys and config changes",
          "Narrowing down: which endpoint, which instance, which dependency",
          "Blameless postmortems: timeline, contributing factors, action items",
        ],
        practice:
          "Inject a fault into your sample app (for example a slow or failing endpoint behind a flag), then use only your dashboard and logs to locate it, and write a one-page blameless postmortem with a timeline and two action items.",
      },
      {
        topicId: null,
        title: "Challenge: make a service observable",
        minutes: 120,
        summary: "Take a service from no visibility to dashboards, alerts and a tested response.",
        learn: [
          "Health and readiness endpoints",
          "Writing a short runbook for an alert",
          "Reviewing whether an alert was actionable after it fires",
        ],
        practice:
          "For a small API, add structured logs with request IDs, golden-signal metrics, a Grafana dashboard, one symptom-based alert with a runbook, then run a game day: break the service, confirm the alert fires, follow the runbook, and record what you would improve.",
      },
    ],
  },
];
