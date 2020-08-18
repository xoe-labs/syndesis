
# explore k8s api
k8sapi:
	kubectl proxy --port=8080 &
	xdg-open http://localhost:8080

# (re)create dev cluster
k3drecreate:
	#!/bin/bash
	k3d cluster delete || true
	mkdir -p /tmp/k3d/kubelet/pods
	# Note: we expose a volume mount of `shared` type to enable the
	# Container Storage Interface related functionlity which depends on mount type shared volumes
	# So we can do `kubectl alpha debug` and span ephemeral containers for debugging
	k3d cluster create --api-port 6550 -p 8081:80@loadbalancer --agents 2 \
		-v /tmp/k3d/kubelet/pods:/var/lib/kubelet/pods:shared \
		--k3s-server-arg '--kube-apiserver-arg=feature-gates=EphemeralContainers=true'

