deploy:
	now --public && now alias && now rm hacktour-app --safe --yes

.PHONY: deploy

