# Generated by Django 5.2 on 2025-04-18 17:16

import django.db.models.deletion
import django_countries.fields
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='BloodDelivery',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
            ],
        ),
        migrations.CreateModel(
            name='BloodTypes',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('types', models.CharField(choices=[('0', '0'), ('A', 'A'), ('B', 'B'), ('AB', 'AB')], max_length=2)),
                ('rh_factor', models.CharField(choices=[('Rh +', 'Rh +'), ('Rh -', 'Rh -')], max_length=5)),
            ],
        ),
        migrations.CreateModel(
            name='BloodOffers',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('volume_ml', models.IntegerField()),
                ('price_per_100ml', models.IntegerField()),
                ('total_price', models.FloatField()),
                ('avaible', models.BooleanField()),
                ('location', django_countries.fields.CountryField(max_length=2)),
                ('expires_at', models.DateField()),
                ('created_at', models.DateField()),
                ('user_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='blood_offers', to=settings.AUTH_USER_MODEL)),
                ('blood_type_id', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='offers', to='polls.bloodtypes')),
            ],
        ),
        migrations.CreateModel(
            name='BloodTransaction',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('total_price', models.FloatField()),
                ('transaction_date', models.DateField()),
                ('buyer_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='purchases', to=settings.AUTH_USER_MODEL)),
                ('offer_id', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='transactions', to='polls.bloodoffers')),
            ],
        ),
    ]
