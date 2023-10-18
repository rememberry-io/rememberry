kubectl cp ./drizzle rememberry/rem-db-stateset-0:/tmp/drizzle
cat kube-execute-sql.sh | kubectl exec -i -n rememberry rem-db-stateset-0 -- sh
