kubectl cp ~/work/rememberry/rememberry/backend/drizzle rememberry/staging-rem-postgresql-0:/tmp
cat ~/work/rememberry/rememberry/backend/scripts/kube-execute-sql.sh | kubectl exec -i -n rememberry staging-rem-postgresql-0 -- /bin/bash -c "export POSTGRES_PASSWORD=$POSTGRES_PASSWORD; /opt/bitnami/scripts/postgresql/entrypoint.sh /bin/bash"
