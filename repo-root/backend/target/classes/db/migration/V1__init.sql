-- V1__init.sql
CREATE TABLE roles (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL
);

CREATE TABLE user_roles (
  user_id BIGINT,
  role_id BIGINT,
  PRIMARY KEY (user_id, role_id)
);

CREATE TABLE appointments (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(255),
  description VARCHAR(1000),
  start_at TIMESTAMP,
  end_at TIMESTAMP,
  user_id BIGINT,
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE refresh_tokens (
  id BIGSERIAL PRIMARY KEY,
  token VARCHAR(255) NOT NULL UNIQUE,
  user_id BIGINT,
  expiry_date TIMESTAMP NOT NULL,
  revoked BOOLEAN NOT NULL DEFAULT FALSE,
  ip_address VARCHAR(255),
  user_agent VARCHAR(2000),
  CONSTRAINT fk_rt_user FOREIGN KEY (user_id) REFERENCES users(id)
);

-- sample roles and users (password is bcrypt placeholder)
INSERT INTO roles (name) VALUES ('ROLE_USER'), ('ROLE_ADMIN');

INSERT INTO users (username, password) VALUES ('alice', '$2a$10$changemechangemechangemech'), ('bob', '$2a$10$changemechangemechangemech');

-- assign roles (example ids 1 & 2)
INSERT INTO user_roles (user_id, role_id) VALUES (1,1), (2,1), (2,2);
