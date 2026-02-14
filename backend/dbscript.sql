CREATE SCHEMA `myplanner` ;

CREATE TABLE `myplanner`.`user` (
  userId INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(45) NOT NULL,
  email VARCHAR(45) NOT NULL,
  password VARCHAR(255) NOT NULL,
  PRIMARY KEY (userId)
  );
  
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
     categoryId INT,
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

-- Sample Data
INSERT INTO `myplanner`.`status` (`statusId`, `statusName`) VALUES ('1', 'To Do');
INSERT INTO `myplanner`.`status` (`statusId`, `statusName`) VALUES ('2', 'In Progress');
INSERT INTO `myplanner`.`status` (`statusId`, `statusName`) VALUES ('3', 'On Hold');
INSERT INTO `myplanner`.`status` (`statusId`, `statusName`) VALUES ('4', 'Done');