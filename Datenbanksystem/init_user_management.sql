INSERT INTO Rollen (Rollenname) VALUES
('Administrator'),
( 'Redakteur'),
( 'Benutzer'),
('Leser'),
('Mitarbeiter');



INSERT INTO Gruppen ( Bezeichnung, Beschreibung) VALUES
( 'Marketing',    'Team für Marketing-Aktivitäten'),
( 'Entwicklung',   'Software-Entwicklungsteam'),
( 'Verwaltung',    'Backoffice und Verwaltung');


INSERT INTO Benutzer (Benutzername, Passwort, RollenID) VALUES
('Mohamad','123456789', 1),
('Muaaz', 'Muaz123',   3),
('Ahmed','Ahmed123', 4);



INSERT INTO Profil (BenutzerID, Name, Email, Geburtsdatum, Telefonnummer, LastModBy) VALUES
(1, 'MoBadr', 'mohamad.bad.h.ali@thm.mni.de', '2003-07-06', '+49 176 72842874',1),
(2, 'Muaaz',  'muaaz@thm.mni.de', '2002-09-01', '+49 172 7654321',2),
(3, 'admin',   'admin1123@gmail.com', '1899-01-01', NULL,3);



INSERT INTO Mitglied (BenutzerID, GruppenID) VALUES
(1, 2),  -- Mohamad in Entwicklung
(1, 3),  -- Mohamad in Verwaltung
(2, 1),  -- Muaaz in Marketing
(3, 1),  -- Ahmed in Marketing
(3, 2),  -- Ahmed in Entwicklung
(3, 3);  -- Ahmed in Verwaltung


INSERT INTO LoginEreignis (BenutzerID, LoginDatum, IpAdresse) VALUES
(1, '2025-07-07 10:15:00', '192.168.0.11'),
(2, '2025-07-07 10:20:00', '192.168.0.12'),
(3, '2025-07-07 10:25:00', '192.168.0.13');
