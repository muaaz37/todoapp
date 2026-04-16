CREATE TABLE Rollen (
  RollenID     INT            AUTO_INCREMENT PRIMARY KEY,
  Rollenname   VARCHAR(100)   NOT NULL
);

CREATE TABLE Gruppen (
  GruppenID    INT            AUTO_INCREMENT PRIMARY KEY,
  Bezeichnung  VARCHAR(100)   NOT NULL,
  Beschreibung TEXT
);

CREATE TABLE Benutzer (
  BenutzerID    INT            AUTO_INCREMENT PRIMARY KEY,
  Benutzername  VARCHAR(100)   NOT NULL UNIQUE,
  Passwort      VARCHAR(255)   NOT NULL,
  RollenID      INT            NOT NULL,
  FOREIGN KEY (RollenID) REFERENCES Rollen(RollenID)
);

CREATE TABLE Profil (
    ProfilID      INT            AUTO_INCREMENT PRIMARY KEY,
    BenutzerID    INT            NOT NULL UNIQUE,
    Name          VARCHAR(255)   NOT NULL,
    Email         VARCHAR(320)   NOT NULL UNIQUE,
    Telefonnummer VARCHAR(50),
    Geburtsdatum  DATE,
    LastModAt     TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    LastModBy     INT            NOT NULL,
    FOREIGN KEY (BenutzerID) REFERENCES Benutzer(BenutzerID),
    FOREIGN KEY (LastModBy)  REFERENCES Benutzer(BenutzerID)
);

CREATE TABLE LoginEreignis (
    LoginID      INT            AUTO_INCREMENT PRIMARY KEY,
    BenutzerID   INT            NOT NULL,
    IpAdresse    VARCHAR(45)    NOT NULL,
    LoginDatum   TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (BenutzerID) REFERENCES Benutzer(BenutzerID)
);

CREATE TABLE Mitglied (
   BenutzerID   INT            NOT NULL,
   GruppenID    INT            NOT NULL,
   PRIMARY KEY (BenutzerID, GruppenID),
   FOREIGN KEY (BenutzerID) REFERENCES Benutzer(BenutzerID),
   FOREIGN KEY (GruppenID)  REFERENCES Gruppen(GruppenID)
);
