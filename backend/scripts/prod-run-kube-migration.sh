kubectl cp ~/work/rememberry/rememberry/backend/drizzle rememberry/rem-db-stateset-0:/tmp
cat ~/work/rememberry/rememberry/backend/scripts/kube-execute-sql.sh | kubectl exec -i -n rememberry rem-db-stateset-0 -- sh
