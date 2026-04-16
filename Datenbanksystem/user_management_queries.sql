-- 1. Geben Sie alle Benutzer mit Name, E-Mail-Adresse und Gruppenmitgliedschaften aus
Select p.Name, p.Email, p.Geburtsdatum, g.Bezeichnung
from Profil p
join Mitglied as m
     on m.BenutzerID = p.BenutzerID
join Gruppen as g
     on g.GruppenID = m.GruppenID;

-- 2. Listen Sie alle Gruppen mit der Anzahl ihrer Mitglieder auf.
Select Bezeichnung, COUNT(BenutzerID) as Mitglieder
from Gruppen as g
join Mitglied as m
  on g.GruppenID = m.GruppenID
GROUP BY Bezeichnung;

-- 3. Finden Sie alle Benutzer, die Administratoren sind.
Select Benutzername as Admin
from Benutzer as b
join Rollen as r
  on b.RollenID = r.RollenID and r.Rollenname = 'Administrator';

-- 4. Zeigen Sie für einen bestimmten Benutzer alle Login-Ereignisse (Zeitstempel, IP-Adresse) an.
select b.Benutzername as name, LoginDatum as Zeitstempel, IpAdresse
from LoginEreignis as log
join Benutzer as b
  on log.BenutzerID = b.BenutzerID and b.Benutzername = 'Muaaz';

-- 5. Listen Sie alle Benutzer auf, die sich in den letzten 7 Tage mindestens einmal eingeloggt haben.
select Benutzername as benutzer from Benutzer
join LoginEreignis as log
  on log.BenutzerID = Benutzer.BenutzerID
      and log.LoginDatum >= NOW() - INTERVAL 7 DAY;

-- 6. Geben Sie alle Benutzer aus, deren Profil zuletzt von einem bestimmten Benutzer geändert wurde.
select b.Benutzername as Benutzer from Profil
join Benutzer b
  on Profil.BenutzerID = b.BenutzerID
      and Profil.LastModBy = 2;


-- 7. Geben Sie für jeden Benutzer die Anzahl seiner Login-Ereignisse aus
select b.Benutzername as Benutzer, count(log.LoginDatum) as Login_Anzahl from Benutzer b
join LoginEreignis as log
  on b.BenutzerID = log.BenutzerID
group by b.benutzername;

-- 8. Ermitteln Sie für jeden Benutzer das Datum seines letzten Logins und geben Sie dieses zusätzlich
-- zum Namen des Benutzers aus.
select b.Benutzername as Benutzer, max(log.LoginDatum) as Letzter_Login from Benutzer b
join LoginEreignis as log
  on b.BenutzerID = log.BenutzerID
group by b.Benutzername;

-- 9. Finden Sie alle Benutzer, die in keiner Gruppe Mitglied sind.
select b.Benutzername from Benutzer b
join Mitglied as m
  on b.BenutzerID = m.BenutzerID and m.GruppenID IS NULL;


-- 10. Ermitteln Sie für die letzten 30 Tage die Anzahl der Logins pro Tag.
select b.Benutzername as Benutzer, DATE(log.LoginDatum) as Tag,  COUNT(*) as Logins_pro_Tag from Benutzer b
join LoginEreignis as log
  on b.BenutzerID = log.BenutzerID
      and log.LoginDatum >= NOW() - INTERVAL 30 DAY
GROUP BY b.benutzername, DATE(log.LoginDatum);


