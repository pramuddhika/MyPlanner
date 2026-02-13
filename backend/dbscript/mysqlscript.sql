CREATE SCHEMA `myplanner` ;

CREATE TABLE `myplanner`.`user` (
  `userId` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `email` VARCHAR(45) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`userId`),
  UNIQUE INDEX `userId_UNIQUE` (`userId` ASC) VISIBLE);
  
CREATE TABLE `myplanner`.`categoryList` (
  categoryId INT NOT NULL AUTO_INCREMENT,
  categoryName VARCHAR(50) NOT NULL,
  userId INT NOT NULL,
  PRIMARY KEY (categoryId),
  FOREIGN KEY (userId) REFERENCES user(userId)
); 

CREATE TABLE `myplanner`.`status` (
  statusId TINYINT,
  statusName VARCHAR(15),
  PRIMARY KEY (statusId)
  );
  
  CREATE TABLE `myplanner`.`task` (
     taskId INT NOT NULL AUTO_INCREMENT,
     topic VARCHAR(30) NOT NULL,
     description VARCHAR(100),
     statusId TINYINT NOT NULL,
     categoryId INT NOT NULL,
     createTime DATETIME NOT NULL,
     startTime DATETIME,
     endTime DATETIME,
     isRemainder BOOLEAN,
     remainderTime DATETIME,
     lastUpdateTime DATETIME NOT NULL,
     userId INT NOT NULL,
     PRIMARY KEY (taskId),
     FOREIGN KEY (statusId) REFERENCES status(statusId),
     FOREIGN KEY (categoryId) REFERENCES categoryList(categoryId),
     FOREIGN KEY (userId) REFERENCES user(userId)
  );