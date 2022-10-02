--
-- PostgreSQL database dump
--

-- Dumped from database version 14.5 (Debian 14.5-1.pgdg110+1)
-- Dumped by pg_dump version 14.5 (Ubuntu 14.5-0ubuntu0.22.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

DROP DATABASE IF EXISTS postgres;
--
-- Name: postgres; Type: DATABASE; Schema: -; Owner: admin
--

CREATE DATABASE postgres WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE = 'en_US.utf8';


ALTER DATABASE postgres OWNER TO admin;

\connect postgres

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: DATABASE postgres; Type: COMMENT; Schema: -; Owner: admin
--

COMMENT ON DATABASE postgres IS 'default administrative connection database';


--
-- Name: public; Type: SCHEMA; Schema: -; Owner: admin
--

CREATE SCHEMA public;


ALTER SCHEMA public OWNER TO admin;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: admin
--

COMMENT ON SCHEMA public IS 'standard public schema';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: account_notification; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.account_notification (
                                           id uuid DEFAULT gen_random_uuid() NOT NULL,
                                           account_id uuid,
                                           notification_id uuid,
                                           created_at timestamp with time zone
);


ALTER TABLE public.account_notification OWNER TO admin;

--
-- Name: accounts; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.accounts (
                               id uuid DEFAULT gen_random_uuid() NOT NULL,
                               keycloak_id character varying(36) NOT NULL,
                               google_id character varying(21),
                               username character varying(100) NOT NULL,
                               email character varying(100) NOT NULL,
                               description character varying(500),
                               phone character varying(10),
                               created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
                               updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
                               fullname character varying(200),
                               avatar character varying(256),
                               disabled_at timestamp with time zone,
                               deleted_at timestamp with time zone,
                               disabled_by uuid,
                               deleted_by uuid,
                               created_by uuid,
                               updated_by uuid,
                               role_id uuid,
                               fcm_token character varying
);


ALTER TABLE public.accounts OWNER TO admin;

--
-- Name: booking_reason; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.booking_reason (
                                     id uuid DEFAULT gen_random_uuid() NOT NULL,
                                     name character varying(100) NOT NULL,
                                     description character varying(500),
                                     created_at timestamp with time zone,
                                     created_by uuid,
                                     updated_at timestamp with time zone,
                                     updated_by uuid,
                                     deleted_at timestamp with time zone,
                                     deleted_by uuid
);


ALTER TABLE public.booking_reason OWNER TO admin;

--
-- Name: booking_reason_hist; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.booking_reason_hist (
                                          booking_reason_id uuid,
                                          name character varying(100),
                                          description character varying(500),
                                          updated_at timestamp with time zone,
                                          updated_by uuid,
                                          created_at timestamp with time zone,
                                          created_by uuid,
                                          deleted_at timestamp with time zone,
                                          deleted_by uuid,
                                          id uuid DEFAULT gen_random_uuid() NOT NULL
);


ALTER TABLE public.booking_reason_hist OWNER TO admin;

--
-- Name: booking_request; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.booking_request (
                                      id uuid DEFAULT gen_random_uuid() NOT NULL,
                                      room_id uuid NOT NULL,
                                      requested_by uuid,
                                      requested_at timestamp with time zone,
                                      status character varying,
                                      checkedin_at timestamp with time zone,
                                      checkedout_at timestamp with time zone,
                                      updated_at timestamp with time zone,
                                      description character varying(500),
                                      updated_by uuid,
                                      booking_reason_id uuid,
                                      cancelled_at timestamp with time zone,
                                      cancelled_by uuid,
                                      checkin_date date,
                                      accepted_by uuid,
                                      accepted_at timestamp with time zone,
                                      cancel_reason character varying(500),
                                      signature_checkin character varying(256),
                                      signature_checkout character varying(256),
                                      booked_for uuid,
                                      checkin_time time without time zone,
                                      checkout_time time without time zone
);


ALTER TABLE public.booking_request OWNER TO admin;

--
-- Name: booking_request_devices; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.booking_request_devices (
                                              id uuid DEFAULT gen_random_uuid(),
                                              booking_request_id uuid,
                                              device_id uuid,
                                              device_quantity integer
);


ALTER TABLE public.booking_request_devices OWNER TO admin;

--
-- Name: booking_room_feedback; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.booking_room_feedback (
                                            id uuid DEFAULT gen_random_uuid() NOT NULL,
                                            feedback_msg character varying(500),
                                            feedback_type uuid,
                                            rate_num smallint,
                                            booking_room_id uuid,
                                            created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
                                            created_by uuid
);


ALTER TABLE public.booking_room_feedback OWNER TO admin;

--
-- Name: device_hist; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.device_hist (
                                  id uuid DEFAULT gen_random_uuid() NOT NULL,
                                  device_id uuid,
                                  name character varying(250),
                                  description character varying(500),
                                  created_at timestamp with time zone,
                                  created_by uuid,
                                  updated_at timestamp with time zone,
                                  updated_by uuid,
                                  disabled_at timestamp with time zone,
                                  disabled_by uuid,
                                  deleted_at timestamp with time zone,
                                  deleted_by uuid,
                                  type uuid
);


ALTER TABLE public.device_hist OWNER TO admin;

--
-- Name: device_type; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.device_type (
                                  id uuid DEFAULT gen_random_uuid() NOT NULL,
                                  name character varying(100) NOT NULL,
                                  description character varying(500),
                                  created_at timestamp with time zone,
                                  created_by uuid,
                                  updated_at timestamp with time zone,
                                  updated_by uuid,
                                  deleted_at timestamp with time zone,
                                  deleted_by uuid
);


ALTER TABLE public.device_type OWNER TO admin;

--
-- Name: device_type_hist; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.device_type_hist (
                                       id uuid DEFAULT gen_random_uuid() NOT NULL,
                                       device_type_id uuid,
                                       name character varying(100),
                                       description character varying(500),
                                       created_at timestamp with time zone,
                                       created_by uuid,
                                       updated_at timestamp with time zone,
                                       updated_by uuid,
                                       deleted_at timestamp with time zone,
                                       deleted_by uuid
);


ALTER TABLE public.device_type_hist OWNER TO admin;

--
-- Name: devices; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.devices (
                              id uuid DEFAULT gen_random_uuid() NOT NULL,
                              name character varying(250) NOT NULL,
                              description character varying(500),
                              created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
                              updated_at timestamp with time zone,
                              created_by uuid,
                              updated_by uuid,
                              disabled_at timestamp with time zone,
                              deleted_at timestamp with time zone,
                              disabled_by uuid,
                              deleted_by uuid,
                              type uuid
);


ALTER TABLE public.devices OWNER TO admin;

--
-- Name: feedback; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.feedback (
                               id uuid DEFAULT gen_random_uuid() NOT NULL,
                               feedback_msg character varying(500),
                               status character varying(100),
                               resolved_by uuid,
                               resolved_at timestamp with time zone,
                               created_by uuid,
                               created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
                               deleted_at timestamp with time zone,
                               deleted_by uuid,
                               feedback_type_id uuid,
                               reply_msg character varying(500),
                               rejected_at timestamp with time zone,
                               rejected_by uuid
);


ALTER TABLE public.feedback OWNER TO admin;

--
-- Name: feedback_type; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.feedback_type (
                                    id uuid DEFAULT gen_random_uuid() NOT NULL,
                                    name character varying(100) NOT NULL,
                                    description character varying(500),
                                    created_at timestamp with time zone,
                                    created_by uuid,
                                    updated_at timestamp with time zone,
                                    updated_by uuid,
                                    deleted_at timestamp with time zone,
                                    deleted_by uuid
);


ALTER TABLE public.feedback_type OWNER TO admin;

--
-- Name: holidays; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.holidays (
                               id uuid DEFAULT gen_random_uuid() NOT NULL,
                               name character varying(100),
                               description character varying(500),
                               created_at timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
                               created_by uuid,
                               updated_at timestamp(6) with time zone,
                               updated_by uuid,
                               deleted_at timestamp(6) with time zone,
                               deleted_by uuid,
                               date_start date,
                               date_end date
);


ALTER TABLE public.holidays OWNER TO admin;

--
-- Name: notification; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.notification (
                                   id uuid DEFAULT gen_random_uuid() NOT NULL,
                                   title character varying(100),
                                   message character varying(500),
                                   created_at timestamp with time zone,
                                   created_by uuid,
                                   deleted_at timestamp with time zone,
                                   deleted_by uuid,
                                   type uuid
);


ALTER TABLE public.notification OWNER TO admin;

--
-- Name: role; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.role (
                           id uuid DEFAULT gen_random_uuid() NOT NULL,
                           name character varying(100) NOT NULL,
                           description character varying(500),
                           created_at timestamp with time zone,
                           created_by uuid,
                           updated_by uuid,
                           updated_at timestamp with time zone,
                           deleted_at timestamp with time zone,
                           deleted_by uuid
);


ALTER TABLE public.role OWNER TO admin;

--
-- Name: role_hist; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.role_hist (
                                id uuid DEFAULT gen_random_uuid() NOT NULL,
                                role_id uuid,
                                name character varying(100),
                                description character varying(500),
                                created_at timestamp with time zone,
                                created_by uuid,
                                updated_at timestamp with time zone,
                                deleted_at timestamp with time zone,
                                updated_by uuid,
                                deleted_by uuid
);


ALTER TABLE public.role_hist OWNER TO admin;

--
-- Name: room_hist; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.room_hist (
                                id uuid DEFAULT gen_random_uuid() NOT NULL,
                                room_id uuid,
                                name character varying(100),
                                description character varying(500),
                                created_at timestamp with time zone,
                                created_by uuid,
                                updated_by uuid,
                                updated_at timestamp with time zone,
                                disabled_at timestamp with time zone,
                                disabled_by uuid,
                                deleted_at timestamp with time zone,
                                deleted_by uuid,
                                type uuid
);


ALTER TABLE public.room_hist OWNER TO admin;

--
-- Name: room_type; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.room_type (
                                id uuid DEFAULT gen_random_uuid() NOT NULL,
                                name character varying(100),
                                description character varying(500),
                                created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
                                created_by uuid,
                                updated_at timestamp with time zone,
                                updated_by uuid,
                                deleted_by uuid,
                                deleted_at timestamp with time zone
);


ALTER TABLE public.room_type OWNER TO admin;

--
-- Name: room_type_hist; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.room_type_hist (
                                     id uuid DEFAULT gen_random_uuid() NOT NULL,
                                     room_type_id uuid,
                                     name character varying(100),
                                     description character varying(500),
                                     created_at timestamp with time zone,
                                     created_by uuid,
                                     updated_at timestamp with time zone,
                                     updated_by uuid,
                                     deleted_at timestamp with time zone,
                                     deleted_by uuid
);


ALTER TABLE public.room_type_hist OWNER TO admin;

--
-- Name: rooms; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.rooms (
                            id uuid DEFAULT gen_random_uuid() NOT NULL,
                            name character varying(100) NOT NULL,
                            description character varying(500),
                            created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
                            updated_at timestamp with time zone,
                            created_by uuid,
                            updated_by uuid,
                            deleted_at timestamp with time zone,
                            disabled_at timestamp with time zone,
                            disabled_by uuid,
                            deleted_by uuid,
                            type uuid,
                            capacity integer
);


ALTER TABLE public.rooms OWNER TO admin;

--
-- Data for Name: account_notification; Type: TABLE DATA; Schema: public; Owner: admin
--

INSERT INTO public.account_notification (id, account_id, notification_id, created_at) VALUES ('d9ac4c6b-0f8a-4004-9d75-03caffe78472', 'f84960cf-7699-4815-8387-39f1a8937ae9', '3b9fc19c-a78a-46ad-9ff2-7c42dd2b2502', NULL);
INSERT INTO public.account_notification (id, account_id, notification_id, created_at) VALUES ('a6228bdf-e506-4f78-91bd-661d07853f70', 'f84960cf-7699-4815-8387-39f1a8937ae9', '1ff1e224-35d9-4d80-bc20-6ac181585e7e', NULL);
INSERT INTO public.account_notification (id, account_id, notification_id, created_at) VALUES ('916e44c1-c8ee-47d4-87cb-e93afe7f1cc2', 'f84960cf-7699-4815-8387-39f1a8937ae9', 'd7af5e39-9996-4bac-a972-174834be4718', NULL);
INSERT INTO public.account_notification (id, account_id, notification_id, created_at) VALUES ('5ab451ed-4479-45dd-b891-0d5611140442', 'f84960cf-7699-4815-8387-39f1a8937ae9', 'c7573f8c-8a82-423a-bc12-1365350f1bf0', NULL);


--
-- Data for Name: accounts; Type: TABLE DATA; Schema: public; Owner: admin
--

INSERT INTO public.accounts (id, keycloak_id, google_id, username, email, description, phone, created_at, updated_at, fullname, avatar, disabled_at, deleted_at, disabled_by, deleted_by, created_by, updated_by, role_id, fcm_token) VALUES ('a6d294a2-57d9-478b-b2ed-35c945c8039e', '35e5b878-abde-4350-a329-af8672c514c2', NULL, 'admin', 'bangmapleproject2@gmail.com', NULL, NULL, '2022-05-25 21:14:52+00', '2022-08-06 09:03:30.572+00', 'admin account', NULL, NULL, NULL, NULL, NULL, NULL, 'c1e309a5-32ab-4ff4-9c01-88abb771893f', 'ee758396-4397-4f35-8e36-905d495631f7', NULL);
INSERT INTO public.accounts (id, keycloak_id, google_id, username, email, description, phone, created_at, updated_at, fullname, avatar, disabled_at, deleted_at, disabled_by, deleted_by, created_by, updated_by, role_id, fcm_token) VALUES ('9de8d827-1d80-40d0-ac86-c1bdd23275d7', '565e9ddc-5b14-4d4b-9a5e-048d6990c501', NULL, 'staff2', 'bangnnse14093811@fpt.edu.vn', 'Hello I''m a staff', '0123456422', '2022-08-02 00:00:00+00', '2022-08-29 20:50:12.0816+00', 'LanNH', 'https://res.cloudinary.com/dryel0zfz/image/upload/accountsAvatar/0569454a-7647-4372-9943-a41183be7d94', NULL, NULL, NULL, NULL, NULL, 'f0284353-a8e3-45c2-b869-5666cb04a5ba', '23dc0f4f-77f8-47c8-a78f-bcad84e5edee', 'fIKOJNlrS-SkrjDHNVEnV8:APA91bHtxIjDYfiYmzIUAPSxLrdRExgmGKdmCJyPmYWVyLF2FaLDzAn5klqY7yBj7ldtJco6zRXhLXa9daGljbNL7lD1I7K0oTo4mSJ4Hg2q1SE8opiMB_7RWRZA621FTrV2FzFEuMCv');
INSERT INTO public.accounts (id, keycloak_id, google_id, username, email, description, phone, created_at, updated_at, fullname, avatar, disabled_at, deleted_at, disabled_by, deleted_by, created_by, updated_by, role_id, fcm_token) VALUES ('b8504a52-8d76-4235-8c85-38a664e59471', 'eb662d55-d51a-42bf-83fb-95c709026e2e', '101987016289956310819', 'lanlnh', 'lanlnhse140961@fpt.edu.vn', NULL, '0916344389', '2022-05-25 21:14:57+00', '2022-08-10 09:14:00.975229+00', 'Cyrus Le', 'https://res.cloudinary.com/dryel0zfz/image/upload/accountsAvatar/61b00e25-f375-451a-a0c5-80b9c6490183', NULL, NULL, NULL, NULL, NULL, 'c1e309a5-32ab-4ff4-9c01-88abb771893f', 'ee758396-4397-4f35-8e36-905d495631f7', NULL);
INSERT INTO public.accounts (id, keycloak_id, google_id, username, email, description, phone, created_at, updated_at, fullname, avatar, disabled_at, deleted_at, disabled_by, deleted_by, created_by, updated_by, role_id, fcm_token) VALUES ('f9904a52-8d76-4235-8c85-38a664e59472', '8ccc547c-7943-445e-b09e-1583e761e7ba', NULL, 'librarian2', 'longnv@gmail.com', NULL, '0932483264', '2022-08-02 00:00:00+00', '2022-08-24 06:48:55.326239+00', 'Librarian Two', 'https://res.cloudinary.com/dryel0zfz/image/upload/accountsAvatar/f225f7b2-c853-4f59-80c3-0ef6904e1b89', NULL, '2022-08-24 06:48:54.977+00', NULL, 'c1e309a5-32ab-4ff4-9c01-88abb771893f', NULL, 'f0284353-a8e3-45c2-b869-5666cb04a5ba', '28314f55-92b4-43d5-a769-50a092c26d34', NULL);
INSERT INTO public.accounts (id, keycloak_id, google_id, username, email, description, phone, created_at, updated_at, fullname, avatar, disabled_at, deleted_at, disabled_by, deleted_by, created_by, updated_by, role_id, fcm_token) VALUES ('d8604a52-8d76-4235-8c85-38a664e59471', '3ab93c0b-6f95-450f-ac54-5b0b6c0e1fca', NULL, 'librarian', 'bangngo@tppsoft.com', 'Hello, I''m a librarian', '0935455555', '2022-08-02 00:00:00+00', '2022-08-30 02:22:26.292909+00', 'TanPM', NULL, NULL, NULL, NULL, NULL, NULL, 'f0284353-a8e3-45c2-b869-5666cb04a5ba', '28314f55-92b4-43d5-a769-50a092c26d34', 'cIFB_20DQK68uGIPGn3_dP:APA91bG31ODZXLXlmS7ZxgpqOt6Dg0Myt1-qp6KAyuaUVh8wjRBH-uRV975xq4t2jc3pqsLreRZHB8M6cF2NPO0SwyxtcAZ5UVRUUBsS0VwVkq2UKJAi2BfI4NTaR7u8zvhBTK2FDpBS');
INSERT INTO public.accounts (id, keycloak_id, google_id, username, email, description, phone, created_at, updated_at, fullname, avatar, disabled_at, deleted_at, disabled_by, deleted_by, created_by, updated_by, role_id, fcm_token) VALUES ('4de8d827-1d80-40d0-ac86-c1bdd23275d3', 'f12649c3-3d0a-42ee-9e7e-e7b3cdfe5625', NULL, 'nghiemtd', 'bangnnse140938@fpt.edu.vn', 'Hello, I''m a librarian', '0123456722', '2022-05-25 21:14:56+00', '2022-08-29 16:11:55.669529+00', 'Trần Duy Nghiêm', 'https://res.cloudinary.com/dryel0zfz/image/upload/accountsAvatar/4de8d827-1d80-40d0-ac86-c1bdd23275d3', NULL, NULL, NULL, NULL, NULL, 'f0284353-a8e3-45c2-b869-5666cb04a5ba', '28314f55-92b4-43d5-a769-50a092c26d34', NULL);
INSERT INTO public.accounts (id, keycloak_id, google_id, username, email, description, phone, created_at, updated_at, fullname, avatar, disabled_at, deleted_at, disabled_by, deleted_by, created_by, updated_by, role_id, fcm_token) VALUES ('f0284353-a8e3-45c2-b869-5666cb04a5ba', '5e1f7d10-4bb2-4699-9baf-bf7c682e120a', '100407855176744187705', 'tanpm', 'tanpmse140151@fpt.edu.vn', 'Hello I''m system admin', '0937145660', '2022-05-25 21:14:56+00', '2022-08-29 11:14:23.836529+00', 'Phạm Minh Tân', 'https://lh3.googleusercontent.com/a-/AFdZucocLEeHZSjFLdyZq3Wicz8FNLLtIcMG6dE65PLg=s96-c', NULL, NULL, NULL, NULL, NULL, 'b48cf66b-f473-444d-9079-5275f07ab649', 'ee758396-4397-4f35-8e36-905d495631f7', 'eB5kjBXvT0u309umlClevK:APA91bHlZQO8QVrsQoh8WLXcIP9cVv3ZwPdt2Qxw2JIyCI8HHL4FjVLpoad8NyA4Owl41eBDAWka8rzE4_X5-jBFxRyk141Ebr0lEmZUtYl0w7zrVvyt7J2UHHWnVhGDd0G1VsUl9-05');
INSERT INTO public.accounts (id, keycloak_id, google_id, username, email, description, phone, created_at, updated_at, fullname, avatar, disabled_at, deleted_at, disabled_by, deleted_by, created_by, updated_by, role_id, fcm_token) VALUES ('b48cf66b-f473-444d-9079-5275f07ab649', '9acd6e17-ed1e-4590-ba9c-e665fa6f375b', '103541875086734068939', 'bangnn', 'bangnnse140937@fpt.edu.vn', NULL, '0932193044', '2022-05-25 21:14:55+00', '2022-08-30 08:41:09.251574+00', 'Ngô Nguyên Bằng', 'https://res.cloudinary.com/dryel0zfz/image/upload/accountsAvatar/310de74c-97f9-4d93-a7b4-29a0b4539293', NULL, NULL, NULL, NULL, NULL, 'c1e309a5-32ab-4ff4-9c01-88abb771893f', 'ee758396-4397-4f35-8e36-905d495631f7', 'eTmW6aUIRwWL07MZ_yTSuN:APA91bGLS4q3Fpd4IAHvtASgmCKccwsQfJWsNgbl4MwcmHwT_czTw3kx-R--33e83KsJBxXB2FbDZoN8zgfj3HWKs5kH09uqgj9JntJU76WWr2I077klhAeSISAXvjkN5greEmLQrEeK');
INSERT INTO public.accounts (id, keycloak_id, google_id, username, email, description, phone, created_at, updated_at, fullname, avatar, disabled_at, deleted_at, disabled_by, deleted_by, created_by, updated_by, role_id, fcm_token) VALUES ('c1e309a5-32ab-4ff4-9c01-88abb771893f', 'a06c284b-4944-49bd-afb0-c899f733446e', '111486222880460150259', 'longnv', 'longnvse140517@fpt.edu.vn', 'Ahiisdjnmc', '0932193096', '2022-05-25 21:14:57+00', '2022-09-02 12:38:37.694979+00', 'LongNV', 'https://res.cloudinary.com/dryel0zfz/image/upload/accountsAvatar/bee6681c-b4de-41c7-8f93-cecc46c8f4b9', NULL, NULL, NULL, NULL, NULL, 'f0284353-a8e3-45c2-b869-5666cb04a5ba', 'ee758396-4397-4f35-8e36-905d495631f7', 'cXDInJCQQ-6l6wIAz5QG3S:APA91bGa9GIqCwlt9Aa7u3dNgbmU1LRTVUljBd0mbpMM6IIVTLBni19QHD-60XyaEV8K5mh0gvPfiywCiLnkbXWaKlF5vEwFrVaWOKnvvq74v9pTRgqO0LgM4Z4ISpOxhuZJTWmCZA8l');
INSERT INTO public.accounts (id, keycloak_id, google_id, username, email, description, phone, created_at, updated_at, fullname, avatar, disabled_at, deleted_at, disabled_by, deleted_by, created_by, updated_by, role_id, fcm_token) VALUES ('1de1d111-1d80-40d0-ac86-c1bdd23275d7', 'a595d7a3-8ff1-45c0-a8e3-e8ad1c2e944a', NULL, 'staff3', 'bangnnse1409381@fpt.edu.vn', 'Hello, I''m a staff', '0123455422', '2022-08-02 00:00:00+00', '2022-08-29 20:39:55.553828+00', 'BangNN', NULL, NULL, NULL, NULL, NULL, NULL, 'f0284353-a8e3-45c2-b869-5666cb04a5ba', '23dc0f4f-77f8-47c8-a78f-bcad84e5edee', 'fIKOJNlrS-SkrjDHNVEnV8:APA91bHtxIjDYfiYmzIUAPSxLrdRExgmGKdmCJyPmYWVyLF2FaLDzAn5klqY7yBj7ldtJco6zRXhLXa9daGljbNL7lD1I7K0oTo4mSJ4Hg2q1SE8opiMB_7RWRZA621FTrV2FzFEuMCv');
INSERT INTO public.accounts (id, keycloak_id, google_id, username, email, description, phone, created_at, updated_at, fullname, avatar, disabled_at, deleted_at, disabled_by, deleted_by, created_by, updated_by, role_id, fcm_token) VALUES ('f84960cf-7699-4815-8387-39f1a8937ae9', '16da2716-bede-4645-9eac-f10bba0a759a', NULL, 'staff', 'bangmapleproject@gmail.com', 'Hello I''m a staff', '0982193096', '2022-05-25 21:14:55+00', '2022-09-09 12:44:04.547904+00', 'NghiêmTD', 'https://res.cloudinary.com/dryel0zfz/image/upload/accountsAvatar/840a93bf-4d40-438f-96ee-5f903b4101e2', NULL, NULL, NULL, NULL, NULL, 'c1e309a5-32ab-4ff4-9c01-88abb771893f', '23dc0f4f-77f8-47c8-a78f-bcad84e5edee', 'cXDInJCQQ-6l6wIAz5QG3S:APA91bGa9GIqCwlt9Aa7u3dNgbmU1LRTVUljBd0mbpMM6IIVTLBni19QHD-60XyaEV8K5mh0gvPfiywCiLnkbXWaKlF5vEwFrVaWOKnvvq74v9pTRgqO0LgM4Z4ISpOxhuZJTWmCZA8l');


--
-- Data for Name: booking_reason; Type: TABLE DATA; Schema: public; Owner: admin
--

INSERT INTO public.booking_reason (id, name, description, created_at, created_by, updated_at, updated_by, deleted_at, deleted_by) VALUES ('c9bde962-84a4-41a8-a6b7-f08689f3dd50', 'Workshop', '', '2022-08-09 03:18:42.79+00', 'c1e309a5-32ab-4ff4-9c01-88abb771893f', '2022-08-10 09:35:11.894+00', 'c1e309a5-32ab-4ff4-9c01-88abb771893f', NULL, NULL);
INSERT INTO public.booking_reason (id, name, description, created_at, created_by, updated_at, updated_by, deleted_at, deleted_by) VALUES ('806e3de3-3f70-470c-bfaa-227b81cd14fb', 'Meeting Capstone', 'Họp đồ án nè', '2022-08-09 03:17:43.292+00', 'c1e309a5-32ab-4ff4-9c01-88abb771893f', '2022-08-16 16:22:52.26+00', 'd8604a52-8d76-4235-8c85-38a664e59471', NULL, NULL);
INSERT INTO public.booking_reason (id, name, description, created_at, created_by, updated_at, updated_by, deleted_at, deleted_by) VALUES ('36738c85-0e8e-4c52-8122-ee0cd76a23a1', 'Presentation', 'Thuyết trình', '2022-08-09 03:18:16.16+00', 'c1e309a5-32ab-4ff4-9c01-88abb771893f', '2022-08-16 16:23:09.82+00', 'd8604a52-8d76-4235-8c85-38a664e59471', NULL, NULL);
INSERT INTO public.booking_reason (id, name, description, created_at, created_by, updated_at, updated_by, deleted_at, deleted_by) VALUES ('f0d80e63-f119-451b-b420-50383b48a77b', 'Talkshow', 'Giao lưu', '2022-08-16 16:25:11.153+00', 'd8604a52-8d76-4235-8c85-38a664e59471', '2022-08-16 16:30:26.239+00', 'd8604a52-8d76-4235-8c85-38a664e59471', NULL, NULL);
INSERT INTO public.booking_reason (id, name, description, created_at, created_by, updated_at, updated_by, deleted_at, deleted_by) VALUES ('9f5dcc5a-0089-4c27-9ae7-f4098915da63', 'Gameshow', '', '2022-08-22 06:03:30.188+00', 'c1e309a5-32ab-4ff4-9c01-88abb771893f', '2022-08-22 06:04:15.168104+00', NULL, '2022-08-22 06:04:14.333+00', 'c1e309a5-32ab-4ff4-9c01-88abb771893f');


--
-- Data for Name: booking_reason_hist; Type: TABLE DATA; Schema: public; Owner: admin
--

INSERT INTO public.booking_reason_hist (booking_reason_id, name, description, updated_at, updated_by, created_at, created_by, deleted_at, deleted_by, id) VALUES ('806e3de3-3f70-470c-bfaa-227b81cd14fb', 'Meeting Capstone', '', NULL, NULL, '2022-08-09 03:17:43.292+00', 'c1e309a5-32ab-4ff4-9c01-88abb771893f', NULL, NULL, '36bac13b-7766-42ca-8d1f-2b19b95a3d4d');
INSERT INTO public.booking_reason_hist (booking_reason_id, name, description, updated_at, updated_by, created_at, created_by, deleted_at, deleted_by, id) VALUES ('36738c85-0e8e-4c52-8122-ee0cd76a23a1', 'Present', '', NULL, NULL, '2022-08-09 03:18:16.16+00', 'c1e309a5-32ab-4ff4-9c01-88abb771893f', NULL, NULL, '341cca9a-1b82-4a85-94f6-30519f8cada2');
INSERT INTO public.booking_reason_hist (booking_reason_id, name, description, updated_at, updated_by, created_at, created_by, deleted_at, deleted_by, id) VALUES ('c9bde962-84a4-41a8-a6b7-f08689f3dd50', 'Workshop', '', NULL, NULL, '2022-08-09 03:18:42.79+00', 'c1e309a5-32ab-4ff4-9c01-88abb771893f', NULL, NULL, '385345f3-d52e-49bd-a939-595c021953d3');
INSERT INTO public.booking_reason_hist (booking_reason_id, name, description, updated_at, updated_by, created_at, created_by, deleted_at, deleted_by, id) VALUES ('c9bde962-84a4-41a8-a6b7-f08689f3dd50', 'Workshop', '', '2022-08-10 09:34:41.937+00', NULL, '2022-08-09 03:18:42.79+00', 'c1e309a5-32ab-4ff4-9c01-88abb771893f', '2022-08-10 09:34:41.123+00', 'c1e309a5-32ab-4ff4-9c01-88abb771893f', '3beb5a90-bd68-4b89-9182-123b38288dc2');
INSERT INTO public.booking_reason_hist (booking_reason_id, name, description, updated_at, updated_by, created_at, created_by, deleted_at, deleted_by, id) VALUES ('c9bde962-84a4-41a8-a6b7-f08689f3dd50', 'Workshop', '', '2022-08-10 09:35:11.894+00', 'c1e309a5-32ab-4ff4-9c01-88abb771893f', '2022-08-09 03:18:42.79+00', 'c1e309a5-32ab-4ff4-9c01-88abb771893f', NULL, NULL, '7ec62218-4793-4aac-a574-58a3a1895189');
INSERT INTO public.booking_reason_hist (booking_reason_id, name, description, updated_at, updated_by, created_at, created_by, deleted_at, deleted_by, id) VALUES ('806e3de3-3f70-470c-bfaa-227b81cd14fb', 'Meeting Capstone', 'Họp đồ án', '2022-08-16 15:32:12.97+00', 'c1e309a5-32ab-4ff4-9c01-88abb771893f', NULL, NULL, NULL, NULL, 'bb463ae0-619e-4b15-b887-f0035c2004d9');
INSERT INTO public.booking_reason_hist (booking_reason_id, name, description, updated_at, updated_by, created_at, created_by, deleted_at, deleted_by, id) VALUES ('806e3de3-3f70-470c-bfaa-227b81cd14fb', 'Meeting Capstone', 'Họp đồ án', '2022-08-16 15:39:38.573+00', 'd8604a52-8d76-4235-8c85-38a664e59471', NULL, NULL, NULL, NULL, '8ac33ad5-73c0-4135-b5d1-ad4b11f4feff');
INSERT INTO public.booking_reason_hist (booking_reason_id, name, description, updated_at, updated_by, created_at, created_by, deleted_at, deleted_by, id) VALUES ('36738c85-0e8e-4c52-8122-ee0cd76a23a1', 'Present', 'Chạy đc nha ba', '2022-08-16 16:15:45.177+00', 'd8604a52-8d76-4235-8c85-38a664e59471', NULL, NULL, NULL, NULL, 'b2bcf033-8785-4736-9d1a-5612356ebd4b');
INSERT INTO public.booking_reason_hist (booking_reason_id, name, description, updated_at, updated_by, created_at, created_by, deleted_at, deleted_by, id) VALUES ('36738c85-0e8e-4c52-8122-ee0cd76a23a1', 'Present', 'Chạy đc nha ba haha', '2022-08-16 16:16:41.851+00', 'c1e309a5-32ab-4ff4-9c01-88abb771893f', NULL, NULL, NULL, NULL, '069567ed-44a7-45bc-ab73-0c0e679bde69');
INSERT INTO public.booking_reason_hist (booking_reason_id, name, description, updated_at, updated_by, created_at, created_by, deleted_at, deleted_by, id) VALUES ('806e3de3-3f70-470c-bfaa-227b81cd14fb', 'Meeting Capstone', 'Họp đồ án nè', '2022-08-16 16:22:52.26+00', 'd8604a52-8d76-4235-8c85-38a664e59471', NULL, NULL, NULL, NULL, '155b22dc-f2ad-4ece-8834-8b6400051957');
INSERT INTO public.booking_reason_hist (booking_reason_id, name, description, updated_at, updated_by, created_at, created_by, deleted_at, deleted_by, id) VALUES ('36738c85-0e8e-4c52-8122-ee0cd76a23a1', 'Presentation', 'Thuyết trình', '2022-08-16 16:23:09.82+00', 'd8604a52-8d76-4235-8c85-38a664e59471', NULL, NULL, NULL, NULL, 'd3b1d720-15be-490f-8298-bfd11cf4939e');
INSERT INTO public.booking_reason_hist (booking_reason_id, name, description, updated_at, updated_by, created_at, created_by, deleted_at, deleted_by, id) VALUES ('f0d80e63-f119-451b-b420-50383b48a77b', 'Talkshow', 'Giao lưu', NULL, NULL, '2022-08-16 16:25:11.153+00', 'd8604a52-8d76-4235-8c85-38a664e59471', NULL, NULL, 'b740db8a-0397-4c1a-b27b-d378b97aaab5');
INSERT INTO public.booking_reason_hist (booking_reason_id, name, description, updated_at, updated_by, created_at, created_by, deleted_at, deleted_by, id) VALUES ('f0d80e63-f119-451b-b420-50383b48a77b', 'Talkshow', 'Giao lưu', '2022-08-16 16:25:18.002+00', NULL, '2022-08-16 16:25:11.153+00', 'd8604a52-8d76-4235-8c85-38a664e59471', '2022-08-16 16:25:17.824+00', 'd8604a52-8d76-4235-8c85-38a664e59471', 'b50a7690-8e08-493a-83ba-3390409f8d1b');
INSERT INTO public.booking_reason_hist (booking_reason_id, name, description, updated_at, updated_by, created_at, created_by, deleted_at, deleted_by, id) VALUES ('f0d80e63-f119-451b-b420-50383b48a77b', 'Talkshow', 'Giao lưu', '2022-08-16 16:30:26.239+00', 'd8604a52-8d76-4235-8c85-38a664e59471', '2022-08-16 16:25:11.153+00', 'd8604a52-8d76-4235-8c85-38a664e59471', NULL, NULL, 'b7442975-2788-452b-9123-cd32e7f2e331');


--
-- Data for Name: booking_request; Type: TABLE DATA; Schema: public; Owner: admin
--

INSERT INTO public.booking_request (id, room_id, requested_by, requested_at, status, checkedin_at, checkedout_at, updated_at, description, updated_by, booking_reason_id, cancelled_at, cancelled_by, checkin_date, accepted_by, accepted_at, cancel_reason, signature_checkin, signature_checkout, booked_for, checkin_time, checkout_time) VALUES ('a31569cb-1dc5-4de2-a112-ce6cc35d7f5a', 'ed99056f-d086-4941-9d5f-6a0a5e12e2ee', 'c1e309a5-32ab-4ff4-9c01-88abb771893f', '2022-09-07 05:49:11.653+00', 'CANCELLED', NULL, NULL, '2022-09-08 05:13:24.161+00', '', 'f84960cf-7699-4815-8387-39f1a8937ae9', 'c9bde962-84a4-41a8-a6b7-f08689f3dd50', '2022-09-08 05:13:24.161+00', 'f84960cf-7699-4815-8387-39f1a8937ae9', '2022-09-08', NULL, NULL, 'Ai mượn đặt giùm', NULL, NULL, 'f84960cf-7699-4815-8387-39f1a8937ae9', '11:00:00', '12:00:00');
INSERT INTO public.booking_request (id, room_id, requested_by, requested_at, status, checkedin_at, checkedout_at, updated_at, description, updated_by, booking_reason_id, cancelled_at, cancelled_by, checkin_date, accepted_by, accepted_at, cancel_reason, signature_checkin, signature_checkout, booked_for, checkin_time, checkout_time) VALUES ('6d6952d3-b2b4-400a-8e29-b0653bac9577', '910edb07-5875-43b7-b605-05794482545d', 'f84960cf-7699-4815-8387-39f1a8937ae9', '2022-09-08 05:18:22.514+00', 'CANCELLED', NULL, NULL, '2022-09-08 05:18:54.684+00', '', 'c1e309a5-32ab-4ff4-9c01-88abb771893f', 'c9bde962-84a4-41a8-a6b7-f08689f3dd50', '2022-09-08 05:18:54.684+00', 'c1e309a5-32ab-4ff4-9c01-88abb771893f', '2022-09-10', NULL, NULL, 'Éo cho đặt', NULL, NULL, 'f84960cf-7699-4815-8387-39f1a8937ae9', '12:00:00', '13:00:00');
INSERT INTO public.booking_request (id, room_id, requested_by, requested_at, status, checkedin_at, checkedout_at, updated_at, description, updated_by, booking_reason_id, cancelled_at, cancelled_by, checkin_date, accepted_by, accepted_at, cancel_reason, signature_checkin, signature_checkout, booked_for, checkin_time, checkout_time) VALUES ('4de0dda4-62ac-4810-84f2-50c40a221308', 'ed99056f-d086-4941-9d5f-6a0a5e12e2ee', 'c1e309a5-32ab-4ff4-9c01-88abb771893f', '2022-09-08 05:17:39.461+00', 'CHECKED_IN', '2022-09-08 06:02:25.15+00', NULL, '2022-09-08 06:02:25.15+00', '', 'c1e309a5-32ab-4ff4-9c01-88abb771893f', 'c9bde962-84a4-41a8-a6b7-f08689f3dd50', NULL, NULL, '2022-09-09', NULL, NULL, NULL, NULL, NULL, 'f84960cf-7699-4815-8387-39f1a8937ae9', '15:00:00', '16:00:00');
INSERT INTO public.booking_request (id, room_id, requested_by, requested_at, status, checkedin_at, checkedout_at, updated_at, description, updated_by, booking_reason_id, cancelled_at, cancelled_by, checkin_date, accepted_by, accepted_at, cancel_reason, signature_checkin, signature_checkout, booked_for, checkin_time, checkout_time) VALUES ('bec05386-2e26-434d-9062-9db2c1e41162', 'ed99056f-d086-4941-9d5f-6a0a5e12e2ee', 'c1e309a5-32ab-4ff4-9c01-88abb771893f', '2022-09-06 13:40:37.839+00', 'CANCELLED', NULL, NULL, '2022-09-09 13:58:00.455+00', '', NULL, 'c9bde962-84a4-41a8-a6b7-f08689f3dd50', '2022-09-09 13:58:00.455+00', NULL, '2022-09-07', NULL, NULL, 'Check-in time has been exceeded. Your request was automatically canceled', NULL, NULL, 'c1e309a5-32ab-4ff4-9c01-88abb771893f', '12:00:00', '13:00:00');
INSERT INTO public.booking_request (id, room_id, requested_by, requested_at, status, checkedin_at, checkedout_at, updated_at, description, updated_by, booking_reason_id, cancelled_at, cancelled_by, checkin_date, accepted_by, accepted_at, cancel_reason, signature_checkin, signature_checkout, booked_for, checkin_time, checkout_time) VALUES ('09770a0f-32cd-43ce-abc5-0920c1b60c59', 'd76358c0-6dc8-4324-b47b-feb0d203c983', 'c1e309a5-32ab-4ff4-9c01-88abb771893f', '2022-09-07 15:53:39.535+00', 'CANCELLED', NULL, NULL, '2022-09-09 13:58:00.605+00', '', NULL, 'c9bde962-84a4-41a8-a6b7-f08689f3dd50', '2022-09-09 13:58:00.605+00', NULL, '2022-09-09', NULL, NULL, 'Check-in time has been exceeded. Your request was automatically canceled', NULL, NULL, 'c1e309a5-32ab-4ff4-9c01-88abb771893f', '11:00:00', '12:00:00');
INSERT INTO public.booking_request (id, room_id, requested_by, requested_at, status, checkedin_at, checkedout_at, updated_at, description, updated_by, booking_reason_id, cancelled_at, cancelled_by, checkin_date, accepted_by, accepted_at, cancel_reason, signature_checkin, signature_checkout, booked_for, checkin_time, checkout_time) VALUES ('d74110cd-b5ea-4a1f-9689-af79481e2d03', 'd76358c0-6dc8-4324-b47b-feb0d203c983', 'c1e309a5-32ab-4ff4-9c01-88abb771893f', '2022-09-07 15:53:39.458+00', 'CANCELLED', NULL, NULL, '2022-09-09 13:58:00.653+00', '', NULL, 'c9bde962-84a4-41a8-a6b7-f08689f3dd50', '2022-09-09 13:58:00.653+00', NULL, '2022-09-08', NULL, NULL, 'Check-in time has been exceeded. Your request was automatically canceled', NULL, NULL, 'c1e309a5-32ab-4ff4-9c01-88abb771893f', '11:00:00', '12:00:00');
INSERT INTO public.booking_request (id, room_id, requested_by, requested_at, status, checkedin_at, checkedout_at, updated_at, description, updated_by, booking_reason_id, cancelled_at, cancelled_by, checkin_date, accepted_by, accepted_at, cancel_reason, signature_checkin, signature_checkout, booked_for, checkin_time, checkout_time) VALUES ('e0ffd9de-2246-4e27-9ba0-1290f9ad7f19', 'ed99056f-d086-4941-9d5f-6a0a5e12e2ee', 'c1e309a5-32ab-4ff4-9c01-88abb771893f', '2022-09-06 13:29:49.539+00', 'CANCELLED', NULL, NULL, '2022-09-09 13:58:00.717+00', '', NULL, 'c9bde962-84a4-41a8-a6b7-f08689f3dd50', '2022-09-09 13:58:00.717+00', NULL, '2022-09-07', NULL, NULL, 'Check-in time has been exceeded. Your request was automatically canceled', NULL, NULL, 'c1e309a5-32ab-4ff4-9c01-88abb771893f', '11:00:00', '12:00:00');


--
-- Data for Name: booking_request_devices; Type: TABLE DATA; Schema: public; Owner: admin
--

INSERT INTO public.booking_request_devices (id, booking_request_id, device_id, device_quantity) VALUES ('6015100b-adee-47b7-a5de-7a612f505534', 'bec05386-2e26-434d-9062-9db2c1e41162', '12672c79-e5a3-4586-a5da-af8ad8c4736a', 1);


--
-- Data for Name: booking_room_feedback; Type: TABLE DATA; Schema: public; Owner: admin
--



--
-- Data for Name: device_hist; Type: TABLE DATA; Schema: public; Owner: admin
--



--
-- Data for Name: device_type; Type: TABLE DATA; Schema: public; Owner: admin
--

INSERT INTO public.device_type (id, name, description, created_at, created_by, updated_at, updated_by, deleted_at, deleted_by) VALUES ('452431d7-e819-4243-8323-a425a50df5f2', 'Teaching equipment', 'Thiết bị giảng dạy', '2022-08-15 05:20:21.778+00', 'd8604a52-8d76-4235-8c85-38a664e59471', '2022-08-15 05:48:31.315+00', 'd8604a52-8d76-4235-8c85-38a664e59471', NULL, NULL);
INSERT INTO public.device_type (id, name, description, created_at, created_by, updated_at, updated_by, deleted_at, deleted_by) VALUES ('fdc446df-fe41-4bbd-a5a1-f61d9350cb11', 'Pen', 'All types of pens', '2022-08-09 02:52:16.593+00', 'c1e309a5-32ab-4ff4-9c01-88abb771893f', NULL, NULL, NULL, NULL);
INSERT INTO public.device_type (id, name, description, created_at, created_by, updated_at, updated_by, deleted_at, deleted_by) VALUES ('df72d60f-6159-4b40-ad68-615c4e76bc3a', 'Remote', 'All types of remotes', '2022-08-09 02:52:33.673+00', 'c1e309a5-32ab-4ff4-9c01-88abb771893f', NULL, NULL, NULL, NULL);
INSERT INTO public.device_type (id, name, description, created_at, created_by, updated_at, updated_by, deleted_at, deleted_by) VALUES ('0dcf1417-2374-4a4a-9a5c-0b396ae39e67', 'Office equipment', '', '2022-08-09 02:54:12.179+00', 'c1e309a5-32ab-4ff4-9c01-88abb771893f', NULL, NULL, NULL, NULL);
INSERT INTO public.device_type (id, name, description, created_at, created_by, updated_at, updated_by, deleted_at, deleted_by) VALUES ('47ec0cc9-188b-4943-9c9f-c1f17be6ac55', 'Electronic device', 'Những thiết bị điện tử', '2022-08-09 02:53:35.98+00', 'c1e309a5-32ab-4ff4-9c01-88abb771893f', '2022-08-15 05:15:33.559+00', 'd8604a52-8d76-4235-8c85-38a664e59471', NULL, NULL);


--
-- Data for Name: device_type_hist; Type: TABLE DATA; Schema: public; Owner: admin
--



--
-- Data for Name: devices; Type: TABLE DATA; Schema: public; Owner: admin
--

INSERT INTO public.devices (id, name, description, created_at, updated_at, created_by, updated_by, disabled_at, deleted_at, disabled_by, deleted_by, type) VALUES ('e03d43a5-7aba-4cfb-95b3-19675a99e90d', 'Desk', 'Lecturer desk', '2022-08-14 16:41:01.649+00', '2022-08-14 16:41:28.36486+00', 'd8604a52-8d76-4235-8c85-38a664e59471', NULL, NULL, '2022-08-14 16:41:28.717+00', NULL, 'd8604a52-8d76-4235-8c85-38a664e59471', '0dcf1417-2374-4a4a-9a5c-0b396ae39e67');
INSERT INTO public.devices (id, name, description, created_at, updated_at, created_by, updated_by, disabled_at, deleted_at, disabled_by, deleted_by, type) VALUES ('e8db9d07-ca48-4190-ad9b-a3a25c74a507', 'Sound System', 'Dàn loa âm thanh', '2022-08-14 16:56:05.9+00', '2022-08-14 16:56:18.114391+00', 'd8604a52-8d76-4235-8c85-38a664e59471', NULL, NULL, '2022-08-14 16:56:18.66+00', NULL, 'd8604a52-8d76-4235-8c85-38a664e59471', '47ec0cc9-188b-4943-9c9f-c1f17be6ac55');
INSERT INTO public.devices (id, name, description, created_at, updated_at, created_by, updated_by, disabled_at, deleted_at, disabled_by, deleted_by, type) VALUES ('26e9aa1f-c641-4f13-974f-5ac36fc92b38', 'Substitue LED Screen', 'Màn hình chiếu thay thế', '2022-08-15 05:41:03.809+00', '2022-08-15 05:41:38.55+00', 'd8604a52-8d76-4235-8c85-38a664e59471', 'd8604a52-8d76-4235-8c85-38a664e59471', NULL, NULL, NULL, NULL, '0dcf1417-2374-4a4a-9a5c-0b396ae39e67');
INSERT INTO public.devices (id, name, description, created_at, updated_at, created_by, updated_by, disabled_at, deleted_at, disabled_by, deleted_by, type) VALUES ('e0b78740-c8b8-4709-bb33-42967a4879aa', 'Table', '', '2022-08-09 02:56:49.997+00', '2022-08-15 10:20:36.987231+00', 'c1e309a5-32ab-4ff4-9c01-88abb771893f', 'c1e309a5-32ab-4ff4-9c01-88abb771893f', NULL, '2022-08-15 10:20:37.928+00', NULL, 'c1e309a5-32ab-4ff4-9c01-88abb771893f', '0dcf1417-2374-4a4a-9a5c-0b396ae39e67');
INSERT INTO public.devices (id, name, description, created_at, updated_at, created_by, updated_by, disabled_at, deleted_at, disabled_by, deleted_by, type) VALUES ('2d4d4ca8-96d1-4728-9c26-5daa241fb7ff', 'TV remote', 'Equipment used to control TV', '2022-08-09 02:56:08.41+00', NULL, 'c1e309a5-32ab-4ff4-9c01-88abb771893f', NULL, NULL, NULL, NULL, NULL, 'df72d60f-6159-4b40-ad68-615c4e76bc3a');
INSERT INTO public.devices (id, name, description, created_at, updated_at, created_by, updated_by, disabled_at, deleted_at, disabled_by, deleted_by, type) VALUES ('0fdbd201-87a5-4ab2-8edb-5404f2f9025d', 'Power socket', '', '2022-08-16 17:59:37.291+00', '2022-08-16 17:59:37.291+00', 'f0284353-a8e3-45c2-b869-5666cb04a5ba', 'f0284353-a8e3-45c2-b869-5666cb04a5ba', NULL, NULL, NULL, NULL, '47ec0cc9-188b-4943-9c9f-c1f17be6ac55');
INSERT INTO public.devices (id, name, description, created_at, updated_at, created_by, updated_by, disabled_at, deleted_at, disabled_by, deleted_by, type) VALUES ('12672c79-e5a3-4586-a5da-af8ad8c4736a', 'Chair', '', '2022-08-09 02:56:31.596+00', NULL, 'c1e309a5-32ab-4ff4-9c01-88abb771893f', NULL, NULL, NULL, NULL, NULL, '0dcf1417-2374-4a4a-9a5c-0b396ae39e67');
INSERT INTO public.devices (id, name, description, created_at, updated_at, created_by, updated_by, disabled_at, deleted_at, disabled_by, deleted_by, type) VALUES ('864f32cf-c3da-4ab3-ac5b-cde1bd4ab0f0', 'Markers', '', '2022-08-09 02:58:24.887+00', '2022-08-14 15:38:52.567+00', 'c1e309a5-32ab-4ff4-9c01-88abb771893f', 'd8604a52-8d76-4235-8c85-38a664e59471', NULL, NULL, NULL, NULL, 'fdc446df-fe41-4bbd-a5a1-f61d9350cb11');
INSERT INTO public.devices (id, name, description, created_at, updated_at, created_by, updated_by, disabled_at, deleted_at, disabled_by, deleted_by, type) VALUES ('9ed52af2-5228-4f69-b57b-2b36c25c7ad2', 'Microphone', 'Sony Brand', '2022-08-14 14:32:56.732+00', '2022-08-14 15:43:49.594358+00', 'd8604a52-8d76-4235-8c85-38a664e59471', NULL, NULL, '2022-08-14 15:43:49.65+00', NULL, 'd8604a52-8d76-4235-8c85-38a664e59471', '47ec0cc9-188b-4943-9c9f-c1f17be6ac55');
INSERT INTO public.devices (id, name, description, created_at, updated_at, created_by, updated_by, disabled_at, deleted_at, disabled_by, deleted_by, type) VALUES ('8a719183-2dbd-41e9-a40d-9b3f34d4c286', 'Pencil', '', '2022-08-09 02:57:59.768+00', '2022-08-14 15:58:27.760388+00', 'c1e309a5-32ab-4ff4-9c01-88abb771893f', NULL, NULL, '2022-08-14 15:58:27.816+00', NULL, 'd8604a52-8d76-4235-8c85-38a664e59471', 'fdc446df-fe41-4bbd-a5a1-f61d9350cb11');
INSERT INTO public.devices (id, name, description, created_at, updated_at, created_by, updated_by, disabled_at, deleted_at, disabled_by, deleted_by, type) VALUES ('e2e0201d-42c4-4981-8cc6-065f8c55d205', 'AC remote', 'Equipment used to control air conditioners', '2022-08-14 15:45:40.394+00', '2022-08-14 16:37:58.938+00', 'd8604a52-8d76-4235-8c85-38a664e59471', 'd8604a52-8d76-4235-8c85-38a664e59471', NULL, NULL, NULL, NULL, 'df72d60f-6159-4b40-ad68-615c4e76bc3a');


--
-- Data for Name: feedback; Type: TABLE DATA; Schema: public; Owner: admin
--

INSERT INTO public.feedback (id, feedback_msg, status, resolved_by, resolved_at, created_by, created_at, deleted_at, deleted_by, feedback_type_id, reply_msg, rejected_at, rejected_by) VALUES ('c0f05776-b87f-40f7-854c-f870b589b931', 'Test cái socket', 'RESOLVED', 'c1e309a5-32ab-4ff4-9c01-88abb771893f', '2022-09-08 05:34:33.352+00', 'f84960cf-7699-4815-8387-39f1a8937ae9', '2022-09-08 05:34:11.982+00', NULL, NULL, 'de2be54d-160d-4497-9d76-cc17dbd9bc19', 'OK', NULL, NULL);
INSERT INTO public.feedback (id, feedback_msg, status, resolved_by, resolved_at, created_by, created_at, deleted_at, deleted_by, feedback_type_id, reply_msg, rejected_at, rejected_by) VALUES ('2d0d6e7c-15b8-4538-920f-37010c9b8080', 'Test lần nữa', 'REJECTED', NULL, NULL, 'f84960cf-7699-4815-8387-39f1a8937ae9', '2022-09-08 05:34:44.369+00', NULL, NULL, 'de2be54d-160d-4497-9d76-cc17dbd9bc19', 'Ok', '2022-09-08 05:34:57.03+00', 'c1e309a5-32ab-4ff4-9c01-88abb771893f');


--
-- Data for Name: feedback_type; Type: TABLE DATA; Schema: public; Owner: admin
--

INSERT INTO public.feedback_type (id, name, description, created_at, created_by, updated_at, updated_by, deleted_at, deleted_by) VALUES ('de2be54d-160d-4497-9d76-cc17dbd9bc19', 'Librarian feedback', '', '2022-08-09 03:07:15.511+00', 'c1e309a5-32ab-4ff4-9c01-88abb771893f', NULL, NULL, NULL, NULL);
INSERT INTO public.feedback_type (id, name, description, created_at, created_by, updated_at, updated_by, deleted_at, deleted_by) VALUES ('f82dabb0-43c7-46f8-8185-303cbdbad390', 'Human Resource', 'Human resource feedback type', '2022-08-22 14:40:38.966+00', 'b8504a52-8d76-4235-8c85-38a664e59471', '2022-08-22 15:19:04.746258+00', 'b8504a52-8d76-4235-8c85-38a664e59471', '2022-08-22 15:19:04.656+00', 'b8504a52-8d76-4235-8c85-38a664e59471');
INSERT INTO public.feedback_type (id, name, description, created_at, created_by, updated_at, updated_by, deleted_at, deleted_by) VALUES ('be41f387-63f8-42d5-b5f6-2236b6d47de2', 'Room feedback', '', '2022-08-09 03:05:57.237+00', 'c1e309a5-32ab-4ff4-9c01-88abb771893f', '2022-08-15 09:52:30.637+00', 'c1e309a5-32ab-4ff4-9c01-88abb771893f', NULL, NULL);
INSERT INTO public.feedback_type (id, name, description, created_at, created_by, updated_at, updated_by, deleted_at, deleted_by) VALUES ('51204862-4083-43a0-88d7-9ea0d4981b7c', 'Sound system feedback', 'Feedback về hệ thống dàn âm thanh', '2022-08-22 14:23:55.822+00', 'd8604a52-8d76-4235-8c85-38a664e59471', '2022-08-22 17:04:36.38+00', 'c1e309a5-32ab-4ff4-9c01-88abb771893f', NULL, NULL);
INSERT INTO public.feedback_type (id, name, description, created_at, created_by, updated_at, updated_by, deleted_at, deleted_by) VALUES ('a129c88d-83d4-45ff-91f6-2977152ec2e7', 'Hygienic feedback', 'Feedback vệ sinh phòng ', '2022-08-15 09:30:57.553+00', 'd8604a52-8d76-4235-8c85-38a664e59471', '2022-08-22 17:08:55.785+00', 'c1e309a5-32ab-4ff4-9c01-88abb771893f', NULL, NULL);
INSERT INTO public.feedback_type (id, name, description, created_at, created_by, updated_at, updated_by, deleted_at, deleted_by) VALUES ('d94d6129-f243-49a6-b6d0-bb18bef046a3', 'Device feedback', 'Feedback về thiết bị', '2022-08-09 03:06:20.999+00', 'c1e309a5-32ab-4ff4-9c01-88abb771893f', '2022-09-08 06:00:41.979+00', 'c1e309a5-32ab-4ff4-9c01-88abb771893f', NULL, NULL);


--
-- Data for Name: holidays; Type: TABLE DATA; Schema: public; Owner: admin
--

INSERT INTO public.holidays (id, name, description, created_at, created_by, updated_at, updated_by, deleted_at, deleted_by, date_start, date_end) VALUES ('fe08fd62-558d-40c0-99dd-f03afa5c7f24', 'New''s Year Day', 'Tết dương lịch', '2022-09-07 12:31:34.461+00', 'b8504a52-8d76-4235-8c85-38a664e59471', NULL, NULL, NULL, NULL, '2022-01-01', '2022-01-03');
INSERT INTO public.holidays (id, name, description, created_at, created_by, updated_at, updated_by, deleted_at, deleted_by, date_start, date_end) VALUES ('a7571466-574a-458e-9bd3-cc37f0181e94', 'Indepedence day', 'Ngày quốc khánh', '2022-09-07 12:22:28.543+00', 'b8504a52-8d76-4235-8c85-38a664e59471', '2022-09-07 18:14:49.182+00', 'b8504a52-8d76-4235-8c85-38a664e59471', NULL, NULL, '2022-09-02', '2022-09-02');
INSERT INTO public.holidays (id, name, description, created_at, created_by, updated_at, updated_by, deleted_at, deleted_by, date_start, date_end) VALUES ('46754a4f-19f8-4763-b051-ccc59587d463', 'Southern Liberation Day & International Workers'' Day', 'Ngày giải phóng đất nước và ngày quốc tế lao động', '2022-09-08 12:51:18.426+00', 'b8504a52-8d76-4235-8c85-38a664e59471', '2022-09-09 16:17:18.991+00', 'b8504a52-8d76-4235-8c85-38a664e59471', NULL, NULL, '2022-04-29', '2022-04-30');
INSERT INTO public.holidays (id, name, description, created_at, created_by, updated_at, updated_by, deleted_at, deleted_by, date_start, date_end) VALUES ('1d1ae391-3bdc-4098-9c45-ae8fe81de474', 'test', 'Sanh thần', '2022-09-08 15:44:36.594+00', 'b8504a52-8d76-4235-8c85-38a664e59471', '2022-09-09 16:30:59.479+00', 'b8504a52-8d76-4235-8c85-38a664e59471', NULL, NULL, '2022-12-14', '2022-12-16');
INSERT INTO public.holidays (id, name, description, created_at, created_by, updated_at, updated_by, deleted_at, deleted_by, date_start, date_end) VALUES ('207d09cd-5e7c-4f47-9f5b-bd64680bb556', 'Test holiday cái nào', 'Test test', '2022-09-07 17:22:26.466+00', 'b8504a52-8d76-4235-8c85-38a664e59471', '2022-09-09 16:54:08.396+00', 'b8504a52-8d76-4235-8c85-38a664e59471', NULL, NULL, '2022-10-01', '2022-10-10');
INSERT INTO public.holidays (id, name, description, created_at, created_by, updated_at, updated_by, deleted_at, deleted_by, date_start, date_end) VALUES ('7a358735-3d88-4e04-b488-11f4d60de0b8', 'Holy name', 'Holy name', '2022-09-09 19:03:28.94+00', 'b8504a52-8d76-4235-8c85-38a664e59471', NULL, NULL, NULL, NULL, '2022-09-17', '2022-09-17');
INSERT INTO public.holidays (id, name, description, created_at, created_by, updated_at, updated_by, deleted_at, deleted_by, date_start, date_end) VALUES ('8671a2de-ffde-4a8e-a921-034360fc74c4', 'Christmas Day', 'Giáng sinh an lành', '2022-09-09 18:18:22.968+00', 'b8504a52-8d76-4235-8c85-38a664e59471', '2022-09-09 19:15:05.403+00', 'b8504a52-8d76-4235-8c85-38a664e59471', NULL, NULL, '2022-12-23', '2022-12-24');


--
-- Data for Name: notification; Type: TABLE DATA; Schema: public; Owner: admin
--

INSERT INTO public.notification (id, title, message, created_at, created_by, deleted_at, deleted_by, type) VALUES ('3b9fc19c-a78a-46ad-9ff2-7c42dd2b2502', 'You have been booked by librarian', 'You have been helped by longnv to book room LB01 on 08-09-2022, from 11:00:00 to 12:00:00.', '2022-09-07 05:49:12.794+00', NULL, NULL, NULL, NULL);
INSERT INTO public.notification (id, title, message, created_at, created_by, deleted_at, deleted_by, type) VALUES ('1ff1e224-35d9-4d80-bc20-6ac181585e7e', 'Your request booking was cancelled', 'Your reservation request on 08/09/2022, from 11:00:00 to 12:00:00 for room LB01 has been cancelled. Reason is "Ai mượn đặt giùm"', '2022-09-08 05:13:25.316+00', NULL, NULL, NULL, NULL);
INSERT INTO public.notification (id, title, message, created_at, created_by, deleted_at, deleted_by, type) VALUES ('d7af5e39-9996-4bac-a972-174834be4718', 'You have been booked by librarian', 'You have been helped by longnv to book room LB01 on 09-09-2022, from 15:00:00 to 16:00:00.', '2022-09-08 05:17:39.801+00', NULL, NULL, NULL, NULL);
INSERT INTO public.notification (id, title, message, created_at, created_by, deleted_at, deleted_by, type) VALUES ('c7573f8c-8a82-423a-bc12-1365350f1bf0', 'Your request booking was cancelled', 'Your reservation request on 10/09/2022, from 12:00:00 to 13:00:00 for room Seminar has been cancelled. Reason is "Éo cho đặt"', '2022-09-08 05:18:55.026+00', NULL, NULL, NULL, NULL);
INSERT INTO public.notification (id, title, message, created_at, created_by, deleted_at, deleted_by, type) VALUES ('c1ac0099-26fb-4958-b90b-586fcea0df8a', 'Your feedback has been resolved', 'Your feedback has been addressed by longnv. The solution given is: OK', '2022-09-08 05:34:33.957+00', NULL, NULL, NULL, NULL);
INSERT INTO public.notification (id, title, message, created_at, created_by, deleted_at, deleted_by, type) VALUES ('255d5ae1-eda2-4f21-ae6c-97f11eeb1b2f', 'Your feedback has been rejected', 'Your feedback has been rejected by longnv. The reason given is: Ok', '2022-09-08 05:34:57.423+00', NULL, NULL, NULL, NULL);


--
-- Data for Name: role; Type: TABLE DATA; Schema: public; Owner: admin
--

INSERT INTO public.role (id, name, description, created_at, created_by, updated_by, updated_at, deleted_at, deleted_by) VALUES ('ee758396-4397-4f35-8e36-905d495631f7', 'System Admin', 'Người quyền lực tối cao, có quyền thay đổi và chỉnh sửa hệ thống, có thể thay đổi đồ hoặc bảo trì đồ dùng bị hư', '2022-07-01 14:37:04.603+00', 'c1e309a5-32ab-4ff4-9c01-88abb771893f', 'f0284353-a8e3-45c2-b869-5666cb04a5ba', '2022-08-06 04:15:57.932+00', NULL, NULL);
INSERT INTO public.role (id, name, description, created_at, created_by, updated_by, updated_at, deleted_at, deleted_by) VALUES ('28314f55-92b4-43d5-a769-50a092c26d34', 'Librarian', 'Các thủ thư trong thư viện FPT, có thể trực tiếp đặt phòng cho các giảng viên khác và kiểm tra và xác thực thông tin của việc đặt phòng', '2022-07-01 14:37:30.779+00', 'c1e309a5-32ab-4ff4-9c01-88abb771893f', 'f0284353-a8e3-45c2-b869-5666cb04a5ba', '2022-08-06 04:17:24.671+00', NULL, NULL);
INSERT INTO public.role (id, name, description, created_at, created_by, updated_by, updated_at, deleted_at, deleted_by) VALUES ('23dc0f4f-77f8-47c8-a78f-bcad84e5edee', 'Staff', 'Bao gồm giảng viên và nhân viên của đại học FPT', '2022-07-01 14:37:20.231+00', 'c1e309a5-32ab-4ff4-9c01-88abb771893f', 'f0284353-a8e3-45c2-b869-5666cb04a5ba', '2022-08-06 04:17:53.216+00', NULL, NULL);
INSERT INTO public.role (id, name, description, created_at, created_by, updated_by, updated_at, deleted_at, deleted_by) VALUES ('8660d0d1-94a3-4d7e-a980-0fd7fe6a5a3d', 'test', '12345', '2022-08-25 04:39:18.318+00', 'f0284353-a8e3-45c2-b869-5666cb04a5ba', 'c1e309a5-32ab-4ff4-9c01-88abb771893f', '2022-08-25 13:09:55.71+00', '2022-08-25 13:09:55.71+00', 'c1e309a5-32ab-4ff4-9c01-88abb771893f');
INSERT INTO public.role (id, name, description, created_at, created_by, updated_by, updated_at, deleted_at, deleted_by) VALUES ('194484fa-d25d-4252-acc4-f70be937d693', 'tests', 'iuasjfhj', '2022-08-25 13:11:11.268+00', 'c1e309a5-32ab-4ff4-9c01-88abb771893f', 'c1e309a5-32ab-4ff4-9c01-88abb771893f', '2022-08-25 13:11:16.375+00', '2022-08-25 13:11:16.375+00', 'c1e309a5-32ab-4ff4-9c01-88abb771893f');


--
-- Data for Name: role_hist; Type: TABLE DATA; Schema: public; Owner: admin
--

INSERT INTO public.role_hist (id, role_id, name, description, created_at, created_by, updated_at, deleted_at, updated_by, deleted_by) VALUES ('b57e7359-a5fb-4ccc-abbd-90d379b8a8ec', '8660d0d1-94a3-4d7e-a980-0fd7fe6a5a3d', 'test', '12345', '2022-08-25 04:39:18.318+00', 'f0284353-a8e3-45c2-b869-5666cb04a5ba', NULL, NULL, NULL, NULL);
INSERT INTO public.role_hist (id, role_id, name, description, created_at, created_by, updated_at, deleted_at, updated_by, deleted_by) VALUES ('5af785c9-6f3f-4cad-9be0-e2a66491492a', '8660d0d1-94a3-4d7e-a980-0fd7fe6a5a3d', 'test', '12345', '2022-08-25 04:39:18.318+00', 'f0284353-a8e3-45c2-b869-5666cb04a5ba', '2022-08-25 13:09:55.71+00', '2022-08-25 13:09:55.71+00', 'c1e309a5-32ab-4ff4-9c01-88abb771893f', 'c1e309a5-32ab-4ff4-9c01-88abb771893f');
INSERT INTO public.role_hist (id, role_id, name, description, created_at, created_by, updated_at, deleted_at, updated_by, deleted_by) VALUES ('898e05cf-9614-4377-b0b3-66e749470318', '194484fa-d25d-4252-acc4-f70be937d693', 'tests', 'iuasjfhj', '2022-08-25 13:11:11.268+00', 'c1e309a5-32ab-4ff4-9c01-88abb771893f', NULL, NULL, NULL, NULL);
INSERT INTO public.role_hist (id, role_id, name, description, created_at, created_by, updated_at, deleted_at, updated_by, deleted_by) VALUES ('21373d1d-affb-4558-85c3-f7ac56b62e12', '194484fa-d25d-4252-acc4-f70be937d693', 'tests', 'iuasjfhj', '2022-08-25 13:11:11.268+00', 'c1e309a5-32ab-4ff4-9c01-88abb771893f', '2022-08-25 13:11:16.375+00', '2022-08-25 13:11:16.375+00', 'c1e309a5-32ab-4ff4-9c01-88abb771893f', 'c1e309a5-32ab-4ff4-9c01-88abb771893f');


--
-- Data for Name: room_hist; Type: TABLE DATA; Schema: public; Owner: admin
--



--
-- Data for Name: room_type; Type: TABLE DATA; Schema: public; Owner: admin
--

INSERT INTO public.room_type (id, name, description, created_at, created_by, updated_at, updated_by, deleted_by, deleted_at) VALUES ('4d758e7e-9f0f-44c1-a240-4a32cb4a5e02', 'test', 'jhbv', '2022-08-22 05:46:12.982+00', 'c1e309a5-32ab-4ff4-9c01-88abb771893f', '2022-08-22 06:24:16.324361+00', 'f0284353-a8e3-45c2-b869-5666cb04a5ba', 'f0284353-a8e3-45c2-b869-5666cb04a5ba', '2022-08-22 06:24:17.471+00');
INSERT INTO public.room_type (id, name, description, created_at, created_by, updated_at, updated_by, deleted_by, deleted_at) VALUES ('a0cede6c-4f40-4ecf-862a-3fb1a502d43d', 'Library lobby', '', '2022-08-09 02:43:53.77+00', 'c1e309a5-32ab-4ff4-9c01-88abb771893f', '2022-08-22 16:54:30.36+00', 'c1e309a5-32ab-4ff4-9c01-88abb771893f', NULL, NULL);
INSERT INTO public.room_type (id, name, description, created_at, created_by, updated_at, updated_by, deleted_by, deleted_at) VALUES ('fe37a926-368d-4ea8-935b-35788b471996', 'Library room', 'Type of rooms with an area equal to a normal classroom', '2022-08-09 02:42:13.013+00', 'c1e309a5-32ab-4ff4-9c01-88abb771893f', NULL, NULL, NULL, NULL);
INSERT INTO public.room_type (id, name, description, created_at, created_by, updated_at, updated_by, deleted_by, deleted_at) VALUES ('05c795aa-5160-4cf7-98c9-579388e1ad11', 'Seminar room', 'Rooms for presentations', '2022-08-09 02:43:22.446+00', 'c1e309a5-32ab-4ff4-9c01-88abb771893f', NULL, NULL, NULL, NULL);


--
-- Data for Name: room_type_hist; Type: TABLE DATA; Schema: public; Owner: admin
--

INSERT INTO public.room_type_hist (id, room_type_id, name, description, created_at, created_by, updated_at, updated_by, deleted_at, deleted_by) VALUES ('a25c7224-18ed-4ca1-a0cc-509213f22fd3', '05c795aa-5160-4cf7-98c9-579388e1ad11', 'Seminar room', 'Rooms for presentations', '2022-08-09 02:43:22.446+00', 'c1e309a5-32ab-4ff4-9c01-88abb771893f', NULL, NULL, NULL, NULL);
INSERT INTO public.room_type_hist (id, room_type_id, name, description, created_at, created_by, updated_at, updated_by, deleted_at, deleted_by) VALUES ('1ebea5f2-15c9-441b-9b18-01fdb0388f49', '4d758e7e-9f0f-44c1-a240-4a32cb4a5e02', 'test', 'jhbv', '2022-08-22 05:46:12.982+00', 'c1e309a5-32ab-4ff4-9c01-88abb771893f', '2022-08-22 06:24:16.324+00', 'f0284353-a8e3-45c2-b869-5666cb04a5ba', '2022-08-22 06:24:17.471+00', 'f0284353-a8e3-45c2-b869-5666cb04a5ba');
INSERT INTO public.room_type_hist (id, room_type_id, name, description, created_at, created_by, updated_at, updated_by, deleted_at, deleted_by) VALUES ('c0912fe2-b13a-4a79-a21d-808102215716', 'a0cede6c-4f40-4ecf-862a-3fb1a502d43d', 'Library lobby', '', '2022-08-09 02:43:53.77+00', 'c1e309a5-32ab-4ff4-9c01-88abb771893f', '2022-08-22 16:54:30.36+00', 'c1e309a5-32ab-4ff4-9c01-88abb771893f', NULL, NULL);
INSERT INTO public.room_type_hist (id, room_type_id, name, description, created_at, created_by, updated_at, updated_by, deleted_at, deleted_by) VALUES ('6c9cd3ef-753b-46d8-b273-b03ade1bc63a', '4d758e7e-9f0f-44c1-a240-4a32cb4a5e02', 'test', 'jhbv', '2022-08-22 05:46:12.982+00', 'c1e309a5-32ab-4ff4-9c01-88abb771893f', '2022-08-22 06:20:55.629+00', 'f0284353-a8e3-45c2-b869-5666cb04a5ba', NULL, NULL);
INSERT INTO public.room_type_hist (id, room_type_id, name, description, created_at, created_by, updated_at, updated_by, deleted_at, deleted_by) VALUES ('f59121cd-069f-4d07-8e33-3d4510a8a4c7', 'a0cede6c-4f40-4ecf-862a-3fb1a502d43d', 'Library lobby', '1', '2022-08-09 02:43:53.77+00', 'c1e309a5-32ab-4ff4-9c01-88abb771893f', '2022-08-22 16:43:17.689+00', 'c1e309a5-32ab-4ff4-9c01-88abb771893f', NULL, NULL);
INSERT INTO public.room_type_hist (id, room_type_id, name, description, created_at, created_by, updated_at, updated_by, deleted_at, deleted_by) VALUES ('56fb2912-5fa9-446d-8792-5dcc93c6f864', 'fe37a926-368d-4ea8-935b-35788b471996', 'Library room', 'Type of rooms with an area equal to a normal classroom', '2022-08-09 02:42:13.013+00', 'c1e309a5-32ab-4ff4-9c01-88abb771893f', NULL, NULL, NULL, NULL);
INSERT INTO public.room_type_hist (id, room_type_id, name, description, created_at, created_by, updated_at, updated_by, deleted_at, deleted_by) VALUES ('ce05688e-acfe-47b9-b023-14bc9edbd051', 'a0cede6c-4f40-4ecf-862a-3fb1a502d43d', 'Library lobby', '', '2022-08-09 02:43:53.77+00', 'c1e309a5-32ab-4ff4-9c01-88abb771893f', NULL, NULL, NULL, NULL);


--
-- Data for Name: rooms; Type: TABLE DATA; Schema: public; Owner: admin
--

INSERT INTO public.rooms (id, name, description, created_at, updated_at, created_by, updated_by, deleted_at, disabled_at, disabled_by, deleted_by, type, capacity) VALUES ('ed99056f-d086-4941-9d5f-6a0a5e12e2ee', 'LB01', 'Capacity: 15-26 people
Room contains:
- 1 TV
- 1 AC
- 1 Lecturer''s Table
- 1 White Board
- 24 chairs', '2022-08-09 02:47:52.179+00', '2022-09-05 06:19:54.454+00', 'c1e309a5-32ab-4ff4-9c01-88abb771893f', 'b8504a52-8d76-4235-8c85-38a664e59471', NULL, NULL, NULL, NULL, 'fe37a926-368d-4ea8-935b-35788b471996', 26);
INSERT INTO public.rooms (id, name, description, created_at, updated_at, created_by, updated_by, deleted_at, disabled_at, disabled_by, deleted_by, type, capacity) VALUES ('d76358c0-6dc8-4324-b47b-feb0d203c983', 'LB02', 'Capacity: 15-26 people
Room contains:
- 1 TV
- 1 AC
- 1 Lecturer''s Desk
- 1 White Board
- 26 chairs.', '2022-08-15 08:45:07.432+00', '2022-09-05 06:20:05.018+00', 'f0284353-a8e3-45c2-b869-5666cb04a5ba', 'b8504a52-8d76-4235-8c85-38a664e59471', NULL, NULL, NULL, NULL, 'fe37a926-368d-4ea8-935b-35788b471996', 26);
INSERT INTO public.rooms (id, name, description, created_at, updated_at, created_by, updated_by, deleted_at, disabled_at, disabled_by, deleted_by, type, capacity) VALUES ('ab1d5266-654c-4687-863d-3592cb72455f', 'LB12', 'Capacity: 10-12 people
Room contains:
- 1 TV
- 1 AC
- 1 Large Meeting Table
- 1 White board
- 7 Chairs', '2022-08-13 06:19:58.309+00', '2022-09-05 06:20:14.122+00', 'b8504a52-8d76-4235-8c85-38a664e59471', 'b8504a52-8d76-4235-8c85-38a664e59471', NULL, NULL, NULL, NULL, 'fe37a926-368d-4ea8-935b-35788b471996', 12);
INSERT INTO public.rooms (id, name, description, created_at, updated_at, created_by, updated_by, deleted_at, disabled_at, disabled_by, deleted_by, type, capacity) VALUES ('cfe9a134-fd9b-4289-b42f-f3cd0ff17fe3', 'LB13', 'Capacity: 15-28 people
Room contains:
- 1 TV
- 1 AC
- 1 Lecturer''s Desk
- 1 Large Meeting Table
- 3 White board
- 28 Chairs', '2022-08-13 06:27:38.803+00', '2022-09-05 06:20:24.368+00', 'b8504a52-8d76-4235-8c85-38a664e59471', 'b8504a52-8d76-4235-8c85-38a664e59471', NULL, NULL, NULL, NULL, 'fe37a926-368d-4ea8-935b-35788b471996', 28);
INSERT INTO public.rooms (id, name, description, created_at, updated_at, created_by, updated_by, deleted_at, disabled_at, disabled_by, deleted_by, type, capacity) VALUES ('a77c0e9a-3a62-4e9e-9bc1-d7b5fc33ea3c', 'LB15', 'Capacity: 10-12 people
Room contains:
- 1 TV
- 1 AC
- 1 Large Meeting Table
- 1 White board
- 9 Chairs', '2022-08-13 06:28:01.609+00', '2022-09-05 06:20:33.254+00', 'b8504a52-8d76-4235-8c85-38a664e59471', 'b8504a52-8d76-4235-8c85-38a664e59471', NULL, NULL, NULL, NULL, 'fe37a926-368d-4ea8-935b-35788b471996', 12);
INSERT INTO public.rooms (id, name, description, created_at, updated_at, created_by, updated_by, deleted_at, disabled_at, disabled_by, deleted_by, type, capacity) VALUES ('6ada1381-f323-4a39-9929-aee2c4a56abc', 'LB21', 'Capacity: 15-17 people
Room contains:
- 1 TV
- 1 AC
- 1 Large Meeting Table
- 2 White board
- 16 Chairs', '2022-08-13 06:28:25.615+00', '2022-09-05 06:20:41.179+00', 'b8504a52-8d76-4235-8c85-38a664e59471', 'b8504a52-8d76-4235-8c85-38a664e59471', NULL, NULL, NULL, NULL, 'fe37a926-368d-4ea8-935b-35788b471996', 17);
INSERT INTO public.rooms (id, name, description, created_at, updated_at, created_by, updated_by, deleted_at, disabled_at, disabled_by, deleted_by, type, capacity) VALUES ('910edb07-5875-43b7-b605-05794482545d', 'Seminar', 'Capacity: 80 people
Room contains:
- 3 AC
- 84 Chairs
- 1 LED Screen
- 1 Sound System + 2 Microphone.', '2022-08-13 06:28:59.982+00', '2022-09-05 06:20:49.474+00', 'b8504a52-8d76-4235-8c85-38a664e59471', 'b8504a52-8d76-4235-8c85-38a664e59471', NULL, NULL, NULL, NULL, '05c795aa-5160-4cf7-98c9-579388e1ad11', 80);
INSERT INTO public.rooms (id, name, description, created_at, updated_at, created_by, updated_by, deleted_at, disabled_at, disabled_by, deleted_by, type, capacity) VALUES ('7680c9ee-9d13-4f60-8587-e78422e8a111', 'Birthday Cy', 'Sanh thần', '2022-09-08 12:55:45.709+00', '2022-09-08 14:00:40.244+00', 'b8504a52-8d76-4235-8c85-38a664e59471', 'b8504a52-8d76-4235-8c85-38a664e59471', NULL, NULL, NULL, NULL, NULL, NULL);


--
-- Name: accounts EMAIL_INDEX; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.accounts
  ADD CONSTRAINT "EMAIL_INDEX" UNIQUE (email);


--
-- Name: accounts GOOGLE_ID_INDEX; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.accounts
  ADD CONSTRAINT "GOOGLE_ID_INDEX" UNIQUE (google_id);


--
-- Name: accounts ID_PK; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.accounts
  ADD CONSTRAINT "ID_PK" PRIMARY KEY (id);


--
-- Name: accounts KEYCLOAK_ID; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.accounts
  ADD CONSTRAINT "KEYCLOAK_ID" UNIQUE (keycloak_id);


--
-- Name: accounts PHONE_INDEX; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.accounts
  ADD CONSTRAINT "PHONE_INDEX" UNIQUE (phone);


--
-- Name: accounts USERNAME_INDEX; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.accounts
  ADD CONSTRAINT "USERNAME_INDEX" UNIQUE (username);


--
-- Name: account_notification account_notification_pk; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.account_notification
  ADD CONSTRAINT account_notification_pk PRIMARY KEY (id);


--
-- Name: booking_reason_hist booking_reason_hist_pk; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.booking_reason_hist
  ADD CONSTRAINT booking_reason_hist_pk PRIMARY KEY (id);


--
-- Name: booking_request booking_request_pk; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.booking_request
  ADD CONSTRAINT booking_request_pk PRIMARY KEY (id);


--
-- Name: booking_room_feedback booking_room_feedback_pk; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.booking_room_feedback
  ADD CONSTRAINT booking_room_feedback_pk PRIMARY KEY (id);


--
-- Name: device_hist device_hist_pk; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.device_hist
  ADD CONSTRAINT device_hist_pk PRIMARY KEY (id);


--
-- Name: device_type_hist device_type_hist_pk; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.device_type_hist
  ADD CONSTRAINT device_type_hist_pk PRIMARY KEY (id);


--
-- Name: device_type device_type_pk; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.device_type
  ADD CONSTRAINT device_type_pk PRIMARY KEY (id);


--
-- Name: devices devices_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.devices
  ADD CONSTRAINT devices_pkey PRIMARY KEY (id);


--
-- Name: feedback feedback_pk; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.feedback
  ADD CONSTRAINT feedback_pk PRIMARY KEY (id);


--
-- Name: feedback_type feedback_type_pk; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.feedback_type
  ADD CONSTRAINT feedback_type_pk PRIMARY KEY (id);


--
-- Name: holidays holidays_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.holidays
  ADD CONSTRAINT holidays_pkey PRIMARY KEY (id);


--
-- Name: rooms idx_48b79438f8707f3d9ca83d85ea; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.rooms
  ADD CONSTRAINT idx_48b79438f8707f3d9ca83d85ea UNIQUE (name);


--
-- Name: devices name; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.devices
  ADD CONSTRAINT name UNIQUE (name);


--
-- Name: notification notification_pk; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.notification
  ADD CONSTRAINT notification_pk PRIMARY KEY (id);


--
-- Name: role_hist role_hist_pk; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.role_hist
  ADD CONSTRAINT role_hist_pk PRIMARY KEY (id);


--
-- Name: role roles_pk; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.role
  ADD CONSTRAINT roles_pk PRIMARY KEY (id);


--
-- Name: room_hist room_hist_pk; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.room_hist
  ADD CONSTRAINT room_hist_pk PRIMARY KEY (id);


--
-- Name: room_type_hist room_type_hist_pk; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.room_type_hist
  ADD CONSTRAINT room_type_hist_pk PRIMARY KEY (id);


--
-- Name: room_type room_type_pk; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.room_type
  ADD CONSTRAINT room_type_pk PRIMARY KEY (id);


--
-- Name: rooms rooms_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.rooms
  ADD CONSTRAINT rooms_pkey PRIMARY KEY (id);


--
-- Name: account_notification_id_uindex; Type: INDEX; Schema: public; Owner: admin
--

CREATE UNIQUE INDEX account_notification_id_uindex ON public.account_notification USING btree (id);


--
-- Name: booking_reason_id_uindex; Type: INDEX; Schema: public; Owner: admin
--

CREATE UNIQUE INDEX booking_reason_id_uindex ON public.booking_reason USING btree (id);


--
-- Name: booking_reason_name_uindex; Type: INDEX; Schema: public; Owner: admin
--

CREATE UNIQUE INDEX booking_reason_name_uindex ON public.booking_reason USING btree (name);


--
-- Name: device_hist_id_uindex; Type: INDEX; Schema: public; Owner: admin
--

CREATE UNIQUE INDEX device_hist_id_uindex ON public.device_hist USING btree (id);


--
-- Name: device_type_hist_id_uindex; Type: INDEX; Schema: public; Owner: admin
--

CREATE UNIQUE INDEX device_type_hist_id_uindex ON public.device_type_hist USING btree (id);


--
-- Name: device_type_name_uindex; Type: INDEX; Schema: public; Owner: admin
--

CREATE UNIQUE INDEX device_type_name_uindex ON public.device_type USING btree (name);


--
-- Name: feedback_type_name_uindex; Type: INDEX; Schema: public; Owner: admin
--

CREATE UNIQUE INDEX feedback_type_name_uindex ON public.feedback_type USING btree (name);


--
-- Name: notification_id_uindex; Type: INDEX; Schema: public; Owner: admin
--

CREATE UNIQUE INDEX notification_id_uindex ON public.notification USING btree (id);


--
-- Name: roles_name_uindex; Type: INDEX; Schema: public; Owner: admin
--

CREATE UNIQUE INDEX roles_name_uindex ON public.role USING btree (name);


--
-- Name: room_hist_id_uindex; Type: INDEX; Schema: public; Owner: admin
--

CREATE UNIQUE INDEX room_hist_id_uindex ON public.room_hist USING btree (id);


--
-- Name: room_type_hist_id_uindex; Type: INDEX; Schema: public; Owner: admin
--

CREATE UNIQUE INDEX room_type_hist_id_uindex ON public.room_type_hist USING btree (id);


--
-- Name: room_type_name_uindex; Type: INDEX; Schema: public; Owner: admin
--

CREATE UNIQUE INDEX room_type_name_uindex ON public.room_type USING btree (name);


--
-- Name: account_notification account_notification_accounts_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.account_notification
  ADD CONSTRAINT account_notification_accounts_id_fk FOREIGN KEY (account_id) REFERENCES public.accounts(id);


--
-- Name: account_notification account_notification_notification_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.account_notification
  ADD CONSTRAINT account_notification_notification_id_fk FOREIGN KEY (notification_id) REFERENCES public.notification(id);


--
-- Name: accounts accounts_accounts_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.accounts
  ADD CONSTRAINT accounts_accounts_id_fk FOREIGN KEY (created_by) REFERENCES public.accounts(id);


--
-- Name: accounts accounts_accounts_id_fk_2; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.accounts
  ADD CONSTRAINT accounts_accounts_id_fk_2 FOREIGN KEY (updated_by) REFERENCES public.accounts(id);


--
-- Name: accounts accounts_accounts_id_fk_3; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.accounts
  ADD CONSTRAINT accounts_accounts_id_fk_3 FOREIGN KEY (disabled_by) REFERENCES public.accounts(id);


--
-- Name: accounts accounts_accounts_id_fk_4; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.accounts
  ADD CONSTRAINT accounts_accounts_id_fk_4 FOREIGN KEY (deleted_by) REFERENCES public.accounts(id);


--
-- Name: accounts accounts_role_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.accounts
  ADD CONSTRAINT accounts_role_id_fk FOREIGN KEY (role_id) REFERENCES public.role(id);


--
-- Name: booking_reason booking_reason_accounts_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.booking_reason
  ADD CONSTRAINT booking_reason_accounts_id_fk FOREIGN KEY (created_by) REFERENCES public.accounts(id);


--
-- Name: booking_reason booking_reason_accounts_id_fk_2; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.booking_reason
  ADD CONSTRAINT booking_reason_accounts_id_fk_2 FOREIGN KEY (updated_by) REFERENCES public.accounts(id);


--
-- Name: booking_reason booking_reason_accounts_id_fk_3; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.booking_reason
  ADD CONSTRAINT booking_reason_accounts_id_fk_3 FOREIGN KEY (deleted_by) REFERENCES public.accounts(id);


--
-- Name: booking_reason_hist booking_reason_hist_booking_reason_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.booking_reason_hist
  ADD CONSTRAINT booking_reason_hist_booking_reason_id_fk FOREIGN KEY (booking_reason_id) REFERENCES public.booking_reason(id);


--
-- Name: booking_request booking_request___accounts_id_fk_4; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.booking_request
  ADD CONSTRAINT booking_request___accounts_id_fk_4 FOREIGN KEY (accepted_by) REFERENCES public.accounts(id);


--
-- Name: booking_request booking_request_accounts_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.booking_request
  ADD CONSTRAINT booking_request_accounts_id_fk FOREIGN KEY (requested_by) REFERENCES public.accounts(id);


--
-- Name: booking_request booking_request_accounts_id_fk_2; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.booking_request
  ADD CONSTRAINT booking_request_accounts_id_fk_2 FOREIGN KEY (updated_by) REFERENCES public.accounts(id);


--
-- Name: booking_request booking_request_accounts_id_fk_3; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.booking_request
  ADD CONSTRAINT booking_request_accounts_id_fk_3 FOREIGN KEY (cancelled_by) REFERENCES public.accounts(id);


--
-- Name: booking_request booking_request_accounts_id_fk_4; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.booking_request
  ADD CONSTRAINT booking_request_accounts_id_fk_4 FOREIGN KEY (booked_for) REFERENCES public.accounts(id);


--
-- Name: booking_request booking_request_booking_reason_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.booking_request
  ADD CONSTRAINT booking_request_booking_reason_id_fk FOREIGN KEY (booking_reason_id) REFERENCES public.booking_reason(id);


--
-- Name: booking_request_devices booking_request_devices_booking_request_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.booking_request_devices
  ADD CONSTRAINT booking_request_devices_booking_request_id_fk FOREIGN KEY (booking_request_id) REFERENCES public.booking_request(id);


--
-- Name: booking_request_devices booking_request_devices_devices_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.booking_request_devices
  ADD CONSTRAINT booking_request_devices_devices_id_fk FOREIGN KEY (device_id) REFERENCES public.devices(id);


--
-- Name: booking_request booking_request_rooms_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.booking_request
  ADD CONSTRAINT booking_request_rooms_id_fk FOREIGN KEY (room_id) REFERENCES public.rooms(id);


--
-- Name: booking_room_feedback booking_room_feedback___type_fk; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.booking_room_feedback
  ADD CONSTRAINT booking_room_feedback___type_fk FOREIGN KEY (feedback_type) REFERENCES public.feedback_type(id);


--
-- Name: booking_room_feedback booking_room_feedback_accounts_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.booking_room_feedback
  ADD CONSTRAINT booking_room_feedback_accounts_id_fk FOREIGN KEY (created_by) REFERENCES public.accounts(id);


--
-- Name: booking_room_feedback booking_room_feedback_booking_request_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.booking_room_feedback
  ADD CONSTRAINT booking_room_feedback_booking_request_id_fk FOREIGN KEY (booking_room_id) REFERENCES public.booking_request(id);


--
-- Name: role_hist created_by; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.role_hist
  ADD CONSTRAINT created_by FOREIGN KEY (created_by) REFERENCES public.accounts(id);


--
-- Name: device_hist created_by_fk; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.device_hist
  ADD CONSTRAINT created_by_fk FOREIGN KEY (created_by) REFERENCES public.accounts(id);


--
-- Name: role_hist deleted_by; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.role_hist
  ADD CONSTRAINT deleted_by FOREIGN KEY (deleted_by) REFERENCES public.accounts(id);


--
-- Name: device_hist deleted_by_fk; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.device_hist
  ADD CONSTRAINT deleted_by_fk FOREIGN KEY (deleted_by) REFERENCES public.accounts(id);


--
-- Name: device_hist device_hist_devices_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.device_hist
  ADD CONSTRAINT device_hist_devices_id_fk FOREIGN KEY (device_id) REFERENCES public.devices(id);


--
-- Name: device_type device_type_accounts_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.device_type
  ADD CONSTRAINT device_type_accounts_id_fk FOREIGN KEY (created_by) REFERENCES public.accounts(id);


--
-- Name: device_type device_type_accounts_id_fk_2; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.device_type
  ADD CONSTRAINT device_type_accounts_id_fk_2 FOREIGN KEY (updated_by) REFERENCES public.accounts(id);


--
-- Name: device_type device_type_accounts_id_fk_3; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.device_type
  ADD CONSTRAINT device_type_accounts_id_fk_3 FOREIGN KEY (deleted_by) REFERENCES public.accounts(id);


--
-- Name: device_type_hist device_type_hist_device_type_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.device_type_hist
  ADD CONSTRAINT device_type_hist_device_type_id_fk FOREIGN KEY (device_type_id) REFERENCES public.device_type(id);


--
-- Name: devices devices_accounts_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.devices
  ADD CONSTRAINT devices_accounts_id_fk FOREIGN KEY (created_by) REFERENCES public.accounts(id);


--
-- Name: devices devices_accounts_id_fk_2; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.devices
  ADD CONSTRAINT devices_accounts_id_fk_2 FOREIGN KEY (updated_by) REFERENCES public.accounts(id);


--
-- Name: devices devices_accounts_id_fk_3; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.devices
  ADD CONSTRAINT devices_accounts_id_fk_3 FOREIGN KEY (disabled_by) REFERENCES public.accounts(id);


--
-- Name: devices devices_accounts_id_fk_4; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.devices
  ADD CONSTRAINT devices_accounts_id_fk_4 FOREIGN KEY (deleted_by) REFERENCES public.accounts(id);


--
-- Name: devices devices_device_type_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.devices
  ADD CONSTRAINT devices_device_type_id_fk FOREIGN KEY (type) REFERENCES public.device_type(id);


--
-- Name: device_hist disabled_by; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.device_hist
  ADD CONSTRAINT disabled_by FOREIGN KEY (disabled_by) REFERENCES public.accounts(id);


--
-- Name: feedback feedback_accounts_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.feedback
  ADD CONSTRAINT feedback_accounts_id_fk FOREIGN KEY (deleted_by) REFERENCES public.accounts(id);


--
-- Name: feedback feedback_accounts_id_fk_2; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.feedback
  ADD CONSTRAINT feedback_accounts_id_fk_2 FOREIGN KEY (rejected_by) REFERENCES public.accounts(id);


--
-- Name: feedback feedback_feedback_type_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.feedback
  ADD CONSTRAINT feedback_feedback_type_id_fk FOREIGN KEY (feedback_type_id) REFERENCES public.feedback_type(id);


--
-- Name: feedback_type feedback_type_accounts_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.feedback_type
  ADD CONSTRAINT feedback_type_accounts_id_fk FOREIGN KEY (created_by) REFERENCES public.accounts(id);


--
-- Name: feedback_type feedback_type_accounts_id_fk_2; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.feedback_type
  ADD CONSTRAINT feedback_type_accounts_id_fk_2 FOREIGN KEY (updated_by) REFERENCES public.accounts(id);


--
-- Name: feedback_type feedback_type_accounts_id_fk_3; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.feedback_type
  ADD CONSTRAINT feedback_type_accounts_id_fk_3 FOREIGN KEY (deleted_by) REFERENCES public.accounts(id);


--
-- Name: holidays holidays_accounts_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.holidays
  ADD CONSTRAINT holidays_accounts_id_fk FOREIGN KEY (created_by) REFERENCES public.accounts(id);


--
-- Name: holidays holidays_accounts_id_fk_1; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.holidays
  ADD CONSTRAINT holidays_accounts_id_fk_1 FOREIGN KEY (deleted_by) REFERENCES public.accounts(id);


--
-- Name: holidays holidays_accounts_id_fk_3; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.holidays
  ADD CONSTRAINT holidays_accounts_id_fk_3 FOREIGN KEY (updated_by) REFERENCES public.accounts(id);


--
-- Name: notification notification_accounts_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.notification
  ADD CONSTRAINT notification_accounts_id_fk FOREIGN KEY (created_by) REFERENCES public.accounts(id);


--
-- Name: notification notification_accounts_id_fk_2; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.notification
  ADD CONSTRAINT notification_accounts_id_fk_2 FOREIGN KEY (deleted_by) REFERENCES public.accounts(id);


--
-- Name: role_hist role_hist_roles_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.role_hist
  ADD CONSTRAINT role_hist_roles_id_fk FOREIGN KEY (role_id) REFERENCES public.role(id);


--
-- Name: role roles_accounts_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.role
  ADD CONSTRAINT roles_accounts_id_fk FOREIGN KEY (created_by) REFERENCES public.accounts(id);


--
-- Name: role roles_accounts_id_fk_2; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.role
  ADD CONSTRAINT roles_accounts_id_fk_2 FOREIGN KEY (deleted_by) REFERENCES public.accounts(id);


--
-- Name: role roles_accounts_id_fk_3; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.role
  ADD CONSTRAINT roles_accounts_id_fk_3 FOREIGN KEY (updated_by) REFERENCES public.accounts(id);


--
-- Name: room_hist room_hist_rooms_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.room_hist
  ADD CONSTRAINT room_hist_rooms_id_fk FOREIGN KEY (room_id) REFERENCES public.rooms(id);


--
-- Name: room_type room_type_accounts_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.room_type
  ADD CONSTRAINT room_type_accounts_id_fk FOREIGN KEY (created_by) REFERENCES public.accounts(id);


--
-- Name: room_type room_type_accounts_id_fk_2; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.room_type
  ADD CONSTRAINT room_type_accounts_id_fk_2 FOREIGN KEY (updated_by) REFERENCES public.accounts(id);


--
-- Name: room_type room_type_accounts_id_fk_4; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.room_type
  ADD CONSTRAINT room_type_accounts_id_fk_4 FOREIGN KEY (deleted_by) REFERENCES public.accounts(id);


--
-- Name: room_type_hist room_type_hist_room_type_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.room_type_hist
  ADD CONSTRAINT room_type_hist_room_type_id_fk FOREIGN KEY (room_type_id) REFERENCES public.room_type(id);


--
-- Name: rooms rooms_accounts_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.rooms
  ADD CONSTRAINT rooms_accounts_id_fk FOREIGN KEY (updated_by) REFERENCES public.accounts(id);


--
-- Name: rooms rooms_accounts_id_fk_1; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.rooms
  ADD CONSTRAINT rooms_accounts_id_fk_1 FOREIGN KEY (created_by) REFERENCES public.accounts(id);


--
-- Name: rooms rooms_accounts_id_fk_2; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.rooms
  ADD CONSTRAINT rooms_accounts_id_fk_2 FOREIGN KEY (disabled_by) REFERENCES public.accounts(id);


--
-- Name: rooms rooms_accounts_id_fk_3; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.rooms
  ADD CONSTRAINT rooms_accounts_id_fk_3 FOREIGN KEY (deleted_by) REFERENCES public.accounts(id);


--
-- Name: rooms rooms_room_type_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.rooms
  ADD CONSTRAINT rooms_room_type_id_fk FOREIGN KEY (type) REFERENCES public.room_type(id);


--
-- Name: device_hist type_fk; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.device_hist
  ADD CONSTRAINT type_fk FOREIGN KEY (type) REFERENCES public.device_type(id);


--
-- Name: role_hist updated_by; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.role_hist
  ADD CONSTRAINT updated_by FOREIGN KEY (updated_by) REFERENCES public.accounts(id);


--
-- Name: device_hist updated_by_fk; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.device_hist
  ADD CONSTRAINT updated_by_fk FOREIGN KEY (updated_by) REFERENCES public.accounts(id);


--
-- PostgreSQL database dump complete
--

