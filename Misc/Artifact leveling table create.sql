CREATE TABLE `Artifact leveling` (
    `ID` INT PRIMARY KEY,
    `L_HP` INT DEFAULT 0,
    `L_ATK` INT DEFAULT 0,
    `L_DEF` INT DEFAULT 0,
    `L_%HP` INT DEFAULT 0,
    `L_%ATK` INT DEFAULT 0,
    `L_%DEF` INT DEFAULT 0,
    `L_EM` INT DEFAULT 0,
    `L_ER` INT DEFAULT 0,
    `L_Crit Rate` INT DEFAULT 0,
    `L_Crit DMG` INT DEFAULT 0,
    `Added substat` VARCHAR(20) DEFAULT 'None',
    FOREIGN KEY (`ID`) REFERENCES `Artifact itself`(`ID`) ON DELETE CASCADE
);
