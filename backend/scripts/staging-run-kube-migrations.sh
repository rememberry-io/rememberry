kubectl cp ~/work/rememberry/rememberry/backend/drizzle rememberry/staging-db-set-0 :/tmp/drizzle
cat ~/work/rememberry/rememberry/backend/scripts/kube-execute-sql.sh | kubectl exec -i -n rememberry staging-db-set-0 -- sh
