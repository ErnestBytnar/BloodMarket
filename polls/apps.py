from django.apps import AppConfig
from django.core.exceptions import ImproperlyConfigured
from django.db.models.signals import post_migrate
from django.db.utils import OperationalError, ProgrammingError


class PollsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'polls'

    def ready(self):
        def create_groups(sender, **kwargs):
            """Tworzenie grup Admin i User po migracji."""
            from django.contrib.auth.models import Group, Permission  # Przeniesiony import!

            try:
                # Tworzenie grup, jeśli nie istnieją
                admin_group, admin_created = Group.objects.get_or_create(name='Admin')
                user_group, user_created = Group.objects.get_or_create(name='User')

                # Nadanie uprawnień Adminowi (wszystkie)
                if admin_created:
                    all_permissions = Permission.objects.all()
                    admin_group.permissions.set(all_permissions)

                # Nadanie uprawnień Użytkownikowi (tylko 'view_')
                if user_created:
                    view_permissions = Permission.objects.filter(codename__startswith="view_")
                    user_group.permissions.set(view_permissions)

            except (OperationalError, ProgrammingError, ImproperlyConfigured):
                # Jeśli baza danych nie jest jeszcze gotowa, pomiń
                pass

        # Podłączenie funkcji do sygnału po migracji
        post_migrate.connect(create_groups, sender=self)
