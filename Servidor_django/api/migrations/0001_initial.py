# Generated by Django 4.1.2 on 2022-10-10 14:40

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Documento',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('documento', models.FileField(upload_to='media/')),
            ],
            options={
                'db_table': 'documetos',
                'managed': True,
            },
        ),
    ]
