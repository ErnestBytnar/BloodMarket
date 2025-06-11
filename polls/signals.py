from django.db.models.signals import post_migrate
from django.dispatch import receiver
from django.contrib.auth.models import User
from polls.models import BloodTypes


@receiver(post_migrate)
def create_admin_and_bloodtypes(sender, **kwargs):
    # Tworzenie admina, jeśli nie istnieje
    if not User.objects.filter(username='admin').exists():
        User.objects.create_superuser('admin', 'admin@example.com', 'admin123')
        print("✔️ Superuser 'admin' created")

    # Dodawanie grup krwi
    blood_groups = ["0", "A", "B", "AB"]
    rh_factors = ["Rh +", "Rh -"]

    for group in blood_groups:
        for rh in rh_factors:
            BloodTypes.objects.get_or_create(types=group, rh_factor=rh)

    print("✔️ BloodTypes initialized")
