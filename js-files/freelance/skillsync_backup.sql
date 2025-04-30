
CREATE TYPE public.bids_status_enum AS ENUM (
    'PENDING',
    'ACCEPTED',
    'REJECTED',
    'WITHDRAWN'
);
ALTER TYPE public.bids_status_enum OWNER TO postgres;
CREATE TYPE public.contracts_status_enum AS ENUM (
    'DRAFT',
    'ACTIVE',
    'COMPLETED',
    'TERMINATED'
);
ALTER TYPE public.contracts_status_enum OWNER TO postgres;
CREATE TYPE public.disputes_status_enum AS ENUM (
    'OPEN',
    'IN_REVIEW',
    'RESOLVED',
    'CLOSED'
);

ALTER TYPE public.disputes_status_enum OWNER TO postgres;


CREATE TYPE public.files_category_enum AS ENUM (
    'DELIVERABLE',
    'BRIEF',
    'INVOICE',
    'MESSAGE_ATTACHMENT'
);


ALTER TYPE public.files_category_enum OWNER TO postgres;

CREATE TYPE public.invoices_status_enum AS ENUM (
    'DRAFT',
    'SENT',
    'PAID',
    'CANCELLED',
    'OVERDUE'
);
ALTER TYPE public.invoices_status_enum OWNER TO postgres;

CREATE TYPE public.milestones_status_enum AS ENUM (
    'PENDING',
    'IN_PROGRESS',
    'COMPLETED',
    'APPROVED'
);
ALTER TYPE public.milestones_status_enum OWNER TO postgres;
CREATE TYPE public.notifications_type_enum AS ENUM (
    'PROJECT',
    'BID',
    'MESSAGE',
    'PAYMENT',
    'MILESTONE',
    'SYSTEM'
);
ALTER TYPE public.notifications_type_enum OWNER TO postgres;

CREATE TYPE public.payments_status_enum AS ENUM (
    'PENDING',
    'COMPLETED',
    'FAILED',
    'REFUNDED'
);


ALTER TYPE public.payments_status_enum OWNER TO postgres;

CREATE TYPE public.projects_payment_type_enum AS ENUM (
    'FIXED',
    'HOURLY'
);
ALTER TYPE public.projects_payment_type_enum OWNER TO postgres;

CREATE TYPE public.projects_status_enum AS ENUM (
    'DRAFT',
    'OPEN',
    'IN_PROGRESS',
    'COMPLETED',
    'CANCELLED',
    'ASSIGNED'
);


ALTER TYPE public.projects_status_enum OWNER TO postgres;

--
-- Name: projects_visibility_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.projects_visibility_enum AS ENUM (
    'PUBLIC',
    'PRIVATE',
    'INVITE_ONLY'
);


ALTER TYPE public.projects_visibility_enum OWNER TO postgres;

--
-- Name: subscriptions_plan_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.subscriptions_plan_enum AS ENUM (
    'FREE',
    'BASIC',
    'PREMIUM',
    'ENTERPRISE'
);


ALTER TYPE public.subscriptions_plan_enum OWNER TO postgres;

CREATE TYPE public.subscriptions_status_enum AS ENUM (
    'ACTIVE',
    'EXPIRED',
    'CANCELLED'
);


ALTER TYPE public.subscriptions_status_enum OWNER TO postgres;
 
CREATE TYPE public.user_skills_proficiency_level_enum AS ENUM (
    '1',
    '2',
    '3',
    '4',
    '5'
);


ALTER TYPE public.user_skills_proficiency_level_enum OWNER TO postgres;

CREATE TYPE public.users_role_enum AS ENUM (
    'CLIENT',
    'FREELANCER',
    'ADMIN'
);

ALTER TYPE public.users_role_enum OWNER TO postgres;
SET default_tablespace = '';
SET default_table_access_method = heap;
CREATE TABLE public.bids (
    id integer NOT NULL,
    project_id integer NOT NULL,
    freelancer_id integer NOT NULL,
    amount numeric(10,2) NOT NULL,
    estimated_days integer NOT NULL,
    proposal text NOT NULL,
    status public.bids_status_enum DEFAULT 'PENDING'::public.bids_status_enum NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);
ALTER TABLE public.bids OWNER TO postgres;
CREATE SEQUENCE public.bids_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.bids_id_seq OWNER TO postgres;
ALTER SEQUENCE public.bids_id_seq OWNED BY public.bids.id;
CREATE TABLE public.client_info (
    id integer NOT NULL,
    user_id integer NOT NULL,
    company_name character varying,
    industry character varying,
    website character varying,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.client_info OWNER TO postgres;
CREATE SEQUENCE public.client_info_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.client_info_id_seq OWNER TO postgres;

ALTER SEQUENCE public.client_info_id_seq OWNED BY public.client_info.id;

CREATE TABLE public.contracts (
    id integer NOT NULL,
    project_id integer NOT NULL,
    client_id integer NOT NULL,
    freelancer_id integer NOT NULL,
    terms text NOT NULL,
    status public.contracts_status_enum DEFAULT 'DRAFT'::public.contracts_status_enum NOT NULL,
    start_date timestamp without time zone NOT NULL,
    end_date timestamp without time zone,
    signed_client_at timestamp without time zone,
    signed_freelancer_at timestamp without time zone
);


ALTER TABLE public.contracts OWNER TO postgres;

CREATE SEQUENCE public.contracts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.contracts_id_seq OWNER TO postgres;
ALTER SEQUENCE public.contracts_id_seq OWNED BY public.contracts.id;


--
-- Name: disputes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.disputes (
    id integer NOT NULL,
    project_id integer NOT NULL,
    reported_by integer NOT NULL,
    reported_against integer NOT NULL,
    reason character varying NOT NULL,
    description text NOT NULL,
    status public.disputes_status_enum DEFAULT 'OPEN'::public.disputes_status_enum NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    resolved_at timestamp without time zone
);


ALTER TABLE public.disputes OWNER TO postgres;

--
-- Name: disputes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.disputes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.disputes_id_seq OWNER TO postgres;

--
-- Name: disputes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.disputes_id_seq OWNED BY public.disputes.id;


--
-- Name: files; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.files (
    id integer NOT NULL,
    project_id integer,
    message_id integer,
    milestone_id integer,
    user_id integer NOT NULL,
    file_name character varying NOT NULL,
    file_path character varying NOT NULL,
    file_type character varying NOT NULL,
    file_size integer NOT NULL,
    uploaded_at timestamp without time zone DEFAULT now() NOT NULL,
    category public.files_category_enum DEFAULT 'MESSAGE_ATTACHMENT'::public.files_category_enum NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.files OWNER TO postgres;

--
-- Name: files_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.files_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.files_id_seq OWNER TO postgres;

--
-- Name: files_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.files_id_seq OWNED BY public.files.id;


--
-- Name: invoices; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.invoices (
    id integer NOT NULL,
    project_id integer NOT NULL,
    milestone_id integer,
    invoice_number character varying NOT NULL,
    amount numeric(10,2) NOT NULL,
    tax_amount numeric(10,2) DEFAULT '0'::numeric NOT NULL,
    total_amount numeric(10,2) NOT NULL,
    status public.invoices_status_enum DEFAULT 'DRAFT'::public.invoices_status_enum NOT NULL,
    due_date timestamp without time zone NOT NULL,
    payment_date timestamp without time zone,
    payment_method character varying,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    freelancer_id integer,
    client_id integer,
    attachments text
);


ALTER TABLE public.invoices OWNER TO postgres;

--
-- Name: invoices_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.invoices_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.invoices_id_seq OWNER TO postgres;

--
-- Name: invoices_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.invoices_id_seq OWNED BY public.invoices.id;


--
-- Name: message_attachments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.message_attachments (
    id integer NOT NULL,
    message_id integer NOT NULL,
    file_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.message_attachments OWNER TO postgres;

--
-- Name: message_attachments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.message_attachments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.message_attachments_id_seq OWNER TO postgres;

--
-- Name: message_attachments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.message_attachments_id_seq OWNED BY public.message_attachments.id;


--
-- Name: messages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.messages (
    id integer NOT NULL,
    project_id integer NOT NULL,
    sender_id integer NOT NULL,
    content text NOT NULL,
    is_read boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.messages OWNER TO postgres;

--
-- Name: messages_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.messages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.messages_id_seq OWNER TO postgres;

--
-- Name: messages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.messages_id_seq OWNED BY public.messages.id;


--
-- Name: milestones; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.milestones (
    id integer NOT NULL,
    project_id integer NOT NULL,
    client_id integer,
    title character varying NOT NULL,
    description text,
    amount numeric(10,2) NOT NULL,
    due_date timestamp without time zone NOT NULL,
    status public.milestones_status_enum DEFAULT 'PENDING'::public.milestones_status_enum NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.milestones OWNER TO postgres;

--
-- Name: milestones_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.milestones_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.milestones_id_seq OWNER TO postgres;

--
-- Name: milestones_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.milestones_id_seq OWNED BY public.milestones.id;


--
-- Name: notifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notifications (
    id integer NOT NULL,
    user_id integer NOT NULL,
    title character varying NOT NULL,
    content text NOT NULL,
    link character varying,
    type public.notifications_type_enum NOT NULL,
    is_read boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.notifications OWNER TO postgres;

--
-- Name: notifications_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.notifications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.notifications_id_seq OWNER TO postgres;

--
-- Name: notifications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.notifications_id_seq OWNED BY public.notifications.id;


--
-- Name: payments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payments (
    id integer NOT NULL,
    invoice_id integer NOT NULL,
    sender_id integer NOT NULL,
    recipient_id integer NOT NULL,
    amount numeric(10,2) NOT NULL,
    status public.payments_status_enum DEFAULT 'PENDING'::public.payments_status_enum NOT NULL,
    transaction_id character varying,
    payment_method character varying NOT NULL,
    platform_fee numeric(10,2) NOT NULL,
    freelancer_amount numeric(10,2) NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.payments OWNER TO postgres;

--
-- Name: payments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.payments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.payments_id_seq OWNER TO postgres;

--
-- Name: payments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.payments_id_seq OWNED BY public.payments.id;


--
-- Name: profiles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.profiles (
    id integer NOT NULL,
    user_id integer NOT NULL,
    bio text,
    profile_image character varying,
    title character varying,
    location character varying,
    website character varying,
    "socialLinks" jsonb,
    hourly_rate integer,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.profiles OWNER TO postgres;

--
-- Name: profiles_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.profiles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.profiles_id_seq OWNER TO postgres;

--
-- Name: profiles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.profiles_id_seq OWNED BY public.profiles.id;


--
-- Name: project_categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.project_categories (
    id integer NOT NULL,
    name character varying NOT NULL,
    description text,
    icon character varying
);


ALTER TABLE public.project_categories OWNER TO postgres;

--
-- Name: project_categories_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.project_categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.project_categories_id_seq OWNER TO postgres;

--
-- Name: project_categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.project_categories_id_seq OWNED BY public.project_categories.id;


--
-- Name: projects; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.projects (
    id integer NOT NULL,
    client_id integer NOT NULL,
    assigned_freelancer_id integer,
    title character varying NOT NULL,
    description text NOT NULL,
    status public.projects_status_enum DEFAULT 'DRAFT'::public.projects_status_enum NOT NULL,
    budget numeric(10,2) NOT NULL,
    deadline timestamp without time zone,
    payment_type public.projects_payment_type_enum DEFAULT 'FIXED'::public.projects_payment_type_enum NOT NULL,
    category_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    visibility public.projects_visibility_enum DEFAULT 'PUBLIC'::public.projects_visibility_enum NOT NULL,
    attachment_urls text[]
);


ALTER TABLE public.projects OWNER TO postgres;

--
-- Name: projects_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.projects_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.projects_id_seq OWNER TO postgres;

--
-- Name: projects_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.projects_id_seq OWNED BY public.projects.id;


--
-- Name: reviews; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reviews (
    id integer NOT NULL,
    project_id integer NOT NULL,
    reviewer_id integer NOT NULL,
    reviewee_id integer NOT NULL,
    rating integer NOT NULL,
    comment text,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.reviews OWNER TO postgres;

--
-- Name: reviews_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.reviews_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.reviews_id_seq OWNER TO postgres;

--
-- Name: reviews_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.reviews_id_seq OWNED BY public.reviews.id;


--
-- Name: skills; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.skills (
    id integer NOT NULL,
    name character varying NOT NULL,
    category character varying NOT NULL,
    description text
);


ALTER TABLE public.skills OWNER TO postgres;

--
-- Name: skills_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.skills_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.skills_id_seq OWNER TO postgres;

--
-- Name: skills_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.skills_id_seq OWNED BY public.skills.id;


--
-- Name: subscriptions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.subscriptions (
    id integer NOT NULL,
    user_id integer NOT NULL,
    plan public.subscriptions_plan_enum DEFAULT 'FREE'::public.subscriptions_plan_enum NOT NULL,
    start_date timestamp without time zone NOT NULL,
    end_date timestamp without time zone NOT NULL,
    amount numeric(10,2) NOT NULL,
    auto_renew boolean DEFAULT false NOT NULL,
    status public.subscriptions_status_enum DEFAULT 'ACTIVE'::public.subscriptions_status_enum NOT NULL
);


ALTER TABLE public.subscriptions OWNER TO postgres;

--
-- Name: subscriptions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.subscriptions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.subscriptions_id_seq OWNER TO postgres;

--
-- Name: subscriptions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.subscriptions_id_seq OWNED BY public.subscriptions.id;


--
-- Name: user_skills; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_skills (
    id integer NOT NULL,
    user_id integer NOT NULL,
    skill_id integer NOT NULL,
    proficiency_level public.user_skills_proficiency_level_enum DEFAULT '1'::public.user_skills_proficiency_level_enum NOT NULL,
    years_experience integer
);


ALTER TABLE public.user_skills OWNER TO postgres;

--
-- Name: user_skills_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_skills_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_skills_id_seq OWNER TO postgres;

--
-- Name: user_skills_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_skills_id_seq OWNED BY public.user_skills.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    email character varying NOT NULL,
    password_hash character varying NOT NULL,
    first_name character varying NOT NULL,
    last_name character varying NOT NULL,
    role public.users_role_enum NOT NULL,
    phone_number character varying,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    is_verified boolean DEFAULT false NOT NULL,
    verification_token character varying,
    refresh_token text,
    last_login timestamp without time zone
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: bids id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bids ALTER COLUMN id SET DEFAULT nextval('public.bids_id_seq'::regclass);


--
-- Name: client_info id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.client_info ALTER COLUMN id SET DEFAULT nextval('public.client_info_id_seq'::regclass);


--
-- Name: contracts id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contracts ALTER COLUMN id SET DEFAULT nextval('public.contracts_id_seq'::regclass);


--
-- Name: disputes id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.disputes ALTER COLUMN id SET DEFAULT nextval('public.disputes_id_seq'::regclass);


--
-- Name: files id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.files ALTER COLUMN id SET DEFAULT nextval('public.files_id_seq'::regclass);


--
-- Name: invoices id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoices ALTER COLUMN id SET DEFAULT nextval('public.invoices_id_seq'::regclass);


--
-- Name: message_attachments id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.message_attachments ALTER COLUMN id SET DEFAULT nextval('public.message_attachments_id_seq'::regclass);


--
-- Name: messages id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages ALTER COLUMN id SET DEFAULT nextval('public.messages_id_seq'::regclass);


--
-- Name: milestones id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.milestones ALTER COLUMN id SET DEFAULT nextval('public.milestones_id_seq'::regclass);


--
-- Name: notifications id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications ALTER COLUMN id SET DEFAULT nextval('public.notifications_id_seq'::regclass);


--
-- Name: payments id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments ALTER COLUMN id SET DEFAULT nextval('public.payments_id_seq'::regclass);


--
-- Name: profiles id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profiles ALTER COLUMN id SET DEFAULT nextval('public.profiles_id_seq'::regclass);


--
-- Name: project_categories id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.project_categories ALTER COLUMN id SET DEFAULT nextval('public.project_categories_id_seq'::regclass);


--
-- Name: projects id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.projects ALTER COLUMN id SET DEFAULT nextval('public.projects_id_seq'::regclass);


--
-- Name: reviews id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews ALTER COLUMN id SET DEFAULT nextval('public.reviews_id_seq'::regclass);


--
-- Name: skills id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.skills ALTER COLUMN id SET DEFAULT nextval('public.skills_id_seq'::regclass);


--
-- Name: subscriptions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subscriptions ALTER COLUMN id SET DEFAULT nextval('public.subscriptions_id_seq'::regclass);


--
-- Name: user_skills id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_skills ALTER COLUMN id SET DEFAULT nextval('public.user_skills_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: bids; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.bids (id, project_id, freelancer_id, amount, estimated_days, proposal, status, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: client_info; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.client_info (id, user_id, company_name, industry, website, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: contracts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.contracts (id, project_id, client_id, freelancer_id, terms, status, start_date, end_date, signed_client_at, signed_freelancer_at) FROM stdin;
\.


--
-- Data for Name: disputes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.disputes (id, project_id, reported_by, reported_against, reason, description, status, created_at, resolved_at) FROM stdin;
\.


--
-- Data for Name: files; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.files (id, project_id, message_id, milestone_id, user_id, file_name, file_path, file_type, file_size, uploaded_at, category, "createdAt") FROM stdin;
\.


--
-- Data for Name: invoices; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.invoices (id, project_id, milestone_id, invoice_number, amount, tax_amount, total_amount, status, due_date, payment_date, payment_method, created_at, updated_at, freelancer_id, client_id, attachments) FROM stdin;
\.


--
-- Data for Name: message_attachments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.message_attachments (id, message_id, file_id, created_at) FROM stdin;
\.


--
-- Data for Name: messages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.messages (id, project_id, sender_id, content, is_read, created_at) FROM stdin;
\.


--
-- Data for Name: milestones; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.milestones (id, project_id, client_id, title, description, amount, due_date, status, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notifications (id, user_id, title, content, link, type, is_read, created_at) FROM stdin;
\.


--
-- Data for Name: payments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payments (id, invoice_id, sender_id, recipient_id, amount, status, transaction_id, payment_method, platform_fee, freelancer_amount, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: profiles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.profiles (id, user_id, bio, profile_image, title, location, website, "socialLinks", hourly_rate, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: project_categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.project_categories (id, name, description, icon) FROM stdin;
\.


--
-- Data for Name: projects; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.projects (id, client_id, assigned_freelancer_id, title, description, status, budget, deadline, payment_type, category_id, created_at, updated_at, visibility, attachment_urls) FROM stdin;
\.


--
-- Data for Name: reviews; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.reviews (id, project_id, reviewer_id, reviewee_id, rating, comment, created_at) FROM stdin;
\.


--
-- Data for Name: skills; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.skills (id, name, category, description) FROM stdin;
\.


--
-- Data for Name: subscriptions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.subscriptions (id, user_id, plan, start_date, end_date, amount, auto_renew, status) FROM stdin;
\.


--
-- Data for Name: user_skills; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_skills (id, user_id, skill_id, proficiency_level, years_experience) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, email, password_hash, first_name, last_name, role, phone_number, created_at, updated_at, is_verified, verification_token, refresh_token, last_login) FROM stdin;
\.


--
-- Name: bids_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.bids_id_seq', 1, false);


--
-- Name: client_info_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.client_info_id_seq', 1, false);


--
-- Name: contracts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.contracts_id_seq', 1, false);


--
-- Name: disputes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.disputes_id_seq', 1, false);


--
-- Name: files_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.files_id_seq', 1, false);


--
-- Name: invoices_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.invoices_id_seq', 1, false);


--
-- Name: message_attachments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.message_attachments_id_seq', 1, false);


--
-- Name: messages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.messages_id_seq', 1, false);


--
-- Name: milestones_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.milestones_id_seq', 1, false);


--
-- Name: notifications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.notifications_id_seq', 1, false);


--
-- Name: payments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.payments_id_seq', 1, false);


--
-- Name: profiles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.profiles_id_seq', 1, false);


--
-- Name: project_categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.project_categories_id_seq', 1, false);


--
-- Name: projects_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.projects_id_seq', 1, false);


--
-- Name: reviews_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.reviews_id_seq', 1, false);


--
-- Name: skills_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.skills_id_seq', 1, false);


--
-- Name: subscriptions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.subscriptions_id_seq', 1, false);


--
-- Name: user_skills_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_skills_id_seq', 1, false);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 1, false);


--
-- Name: project_categories PK_03d7af35c2601369d030b3617bc; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.project_categories
    ADD CONSTRAINT "PK_03d7af35c2601369d030b3617bc" PRIMARY KEY (id);


--
-- Name: client_info PK_09bdc12b41c346ad56afee8d6cc; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.client_info
    ADD CONSTRAINT "PK_09bdc12b41c346ad56afee8d6cc" PRIMARY KEY (id);


--
-- Name: milestones PK_0bdbfe399c777a6a8520ff902d9; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.milestones
    ADD CONSTRAINT "PK_0bdbfe399c777a6a8520ff902d9" PRIMARY KEY (id);


--
-- Name: skills PK_0d3212120f4ecedf90864d7e298; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.skills
    ADD CONSTRAINT "PK_0d3212120f4ecedf90864d7e298" PRIMARY KEY (id);


--
-- Name: messages PK_18325f38ae6de43878487eff986; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT "PK_18325f38ae6de43878487eff986" PRIMARY KEY (id);


--
-- Name: payments PK_197ab7af18c93fbb0c9b28b4a59; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "PK_197ab7af18c93fbb0c9b28b4a59" PRIMARY KEY (id);


--
-- Name: reviews PK_231ae565c273ee700b283f15c1d; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT "PK_231ae565c273ee700b283f15c1d" PRIMARY KEY (id);


--
-- Name: contracts PK_2c7b8f3a7b1acdd49497d83d0fb; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contracts
    ADD CONSTRAINT "PK_2c7b8f3a7b1acdd49497d83d0fb" PRIMARY KEY (id);


--
-- Name: disputes PK_3c97580d01c1a4b0b345c42a107; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.disputes
    ADD CONSTRAINT "PK_3c97580d01c1a4b0b345c42a107" PRIMARY KEY (id);


--
-- Name: user_skills PK_4d0a72117fbf387752dbc8506af; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_skills
    ADD CONSTRAINT "PK_4d0a72117fbf387752dbc8506af" PRIMARY KEY (id);


--
-- Name: projects PK_6271df0a7aed1d6c0691ce6ac50; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT "PK_6271df0a7aed1d6c0691ce6ac50" PRIMARY KEY (id);


--
-- Name: invoices PK_668cef7c22a427fd822cc1be3ce; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT "PK_668cef7c22a427fd822cc1be3ce" PRIMARY KEY (id);


--
-- Name: notifications PK_6a72c3c0f683f6462415e653c3a; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT "PK_6a72c3c0f683f6462415e653c3a" PRIMARY KEY (id);


--
-- Name: files PK_6c16b9093a142e0e7613b04a3d9; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.files
    ADD CONSTRAINT "PK_6c16b9093a142e0e7613b04a3d9" PRIMARY KEY (id);


--
-- Name: bids PK_7950d066d322aab3a488ac39fe5; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bids
    ADD CONSTRAINT "PK_7950d066d322aab3a488ac39fe5" PRIMARY KEY (id);


--
-- Name: profiles PK_8e520eb4da7dc01d0e190447c8e; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT "PK_8e520eb4da7dc01d0e190447c8e" PRIMARY KEY (id);


--
-- Name: users PK_a3ffb1c0c8416b9fc6f907b7433; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY (id);


--
-- Name: subscriptions PK_a87248d73155605cf782be9ee5e; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT "PK_a87248d73155605cf782be9ee5e" PRIMARY KEY (id);


--
-- Name: message_attachments PK_e5085d973567c61e9306f10f95b; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.message_attachments
    ADD CONSTRAINT "PK_e5085d973567c61e9306f10f95b" PRIMARY KEY (id);


--
-- Name: client_info REL_9c2cf45d2070dfb5ff6a3230b0; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.client_info
    ADD CONSTRAINT "REL_9c2cf45d2070dfb5ff6a3230b0" UNIQUE (user_id);


--
-- Name: profiles REL_9e432b7df0d182f8d292902d1a; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT "REL_9e432b7df0d182f8d292902d1a" UNIQUE (user_id);


--
-- Name: reviews UQ_1cc9ecd05ca1b4c7e42ffbca65d; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT "UQ_1cc9ecd05ca1b4c7e42ffbca65d" UNIQUE (project_id, reviewer_id, reviewee_id);


--
-- Name: contracts UQ_6dbcbd3f7392ba65c8832e04435; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contracts
    ADD CONSTRAINT "UQ_6dbcbd3f7392ba65c8832e04435" UNIQUE (project_id);


--
-- Name: user_skills UQ_816eba68a0ca1b837ec15daefc7; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_skills
    ADD CONSTRAINT "UQ_816eba68a0ca1b837ec15daefc7" UNIQUE (user_id, skill_id);


--
-- Name: skills UQ_81f05095507fd84aa2769b4a522; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.skills
    ADD CONSTRAINT "UQ_81f05095507fd84aa2769b4a522" UNIQUE (name);


--
-- Name: project_categories UQ_8270e7fe222cdc03f77a9fda58f; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.project_categories
    ADD CONSTRAINT "UQ_8270e7fe222cdc03f77a9fda58f" UNIQUE (name);


--
-- Name: users UQ_97672ac88f789774dd47f7c8be3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE (email);


--
-- Name: invoices UQ_d8f8d3788694e1b3f96c42c36fb; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT "UQ_d8f8d3788694e1b3f96c42c36fb" UNIQUE (invoice_number);


--
-- Name: messages FK_0139a4041dc028434fb8b89ae47; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT "FK_0139a4041dc028434fb8b89ae47" FOREIGN KEY (project_id) REFERENCES public.projects(id);


--
-- Name: payments FK_0192ca7ba9de2d626df14aa4b24; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "FK_0192ca7ba9de2d626df14aa4b24" FOREIGN KEY (recipient_id) REFERENCES public.users(id);


--
-- Name: milestones FK_2204463ea4c5c1872e1fb2b8ffb; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.milestones
    ADD CONSTRAINT "FK_2204463ea4c5c1872e1fb2b8ffb" FOREIGN KEY (project_id) REFERENCES public.projects(id);


--
-- Name: messages FK_22133395bd13b970ccd0c34ab22; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT "FK_22133395bd13b970ccd0c34ab22" FOREIGN KEY (sender_id) REFERENCES public.users(id);


--
-- Name: disputes FK_23c44b8b6459755cc6bc9afb094; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.disputes
    ADD CONSTRAINT "FK_23c44b8b6459755cc6bc9afb094" FOREIGN KEY (project_id) REFERENCES public.projects(id);


--
-- Name: disputes FK_241b01032be4604f9083d730a55; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.disputes
    ADD CONSTRAINT "FK_241b01032be4604f9083d730a55" FOREIGN KEY (reported_against) REFERENCES public.users(id);


--
-- Name: bids FK_402daf8cf5d3113be368c50a733; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bids
    ADD CONSTRAINT "FK_402daf8cf5d3113be368c50a733" FOREIGN KEY (freelancer_id) REFERENCES public.users(id);


--
-- Name: reviews FK_478ede6c09476e1f5ba673f34dd; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT "FK_478ede6c09476e1f5ba673f34dd" FOREIGN KEY (project_id) REFERENCES public.projects(id);


ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "FK_4b02836bd57e578c437257dda58" FOREIGN KEY (sender_id) REFERENCES public.users(id);


ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "FK_563a5e248518c623eebd987d43e" FOREIGN KEY (invoice_id) REFERENCES public.invoices(id);

ALTER TABLE ONLY public.files
    ADD CONSTRAINT "FK_63ee0a7c78bd7a1968a0893edab" FOREIGN KEY (message_id) REFERENCES public.messages(id);


ALTER TABLE ONLY public.user_skills
    ADD CONSTRAINT "FK_6926002c360291df66bb2c5fdeb" FOREIGN KEY (user_id) REFERENCES public.users(id);

ALTER TABLE ONLY public.files
    ADD CONSTRAINT "FK_6c21bcc4fe93c9b1058ec6d2b3d" FOREIGN KEY (milestone_id) REFERENCES public.milestones(id);


ALTER TABLE ONLY public.contracts
    ADD CONSTRAINT "FK_6dbcbd3f7392ba65c8832e04435" FOREIGN KEY (project_id) REFERENCES public.projects(id);

ALTER TABLE ONLY public.bids
    ADD CONSTRAINT "FK_7a9a4aa9b5fc8b4881fbc90d28a" FOREIGN KEY (project_id) REFERENCES public.projects(id);


ALTER TABLE ONLY public.message_attachments
    ADD CONSTRAINT "FK_8b66fb69a696854d5ff08ae6e2d" FOREIGN KEY (file_id) REFERENCES public.files(id);

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT "FK_92e950a2513a79bb3fab273c92e" FOREIGN KEY (reviewer_id) REFERENCES public.users(id);


ALTER TABLE ONLY public.contracts
    ADD CONSTRAINT "FK_9945462ca96b2c7d0a97e012cdc" FOREIGN KEY (client_id) REFERENCES public.users(id);


ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT "FK_9a8a82462cab47c73d25f49261f" FOREIGN KEY (user_id) REFERENCES public.users(id);


ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT "FK_9ba18dbe4ea525518c4b32df4b6" FOREIGN KEY (project_id) REFERENCES public.projects(id);


ALTER TABLE ONLY public.client_info
    ADD CONSTRAINT "FK_9c2cf45d2070dfb5ff6a3230b08" FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;



ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT "FK_9e432b7df0d182f8d292902d1a2" FOREIGN KEY (user_id) REFERENCES public.users(id);


ALTER TABLE ONLY public.files
    ADD CONSTRAINT "FK_a7435dbb7583938d5e7d1376041" FOREIGN KEY (user_id) REFERENCES public.users(id);

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT "FK_a7b3e1afadd6b52f3b6864745e3" FOREIGN KEY (reviewee_id) REFERENCES public.users(id);


ALTER TABLE ONLY public.contracts
    ADD CONSTRAINT "FK_a94ffd0b1a052fddaa84d4cb186" FOREIGN KEY (freelancer_id) REFERENCES public.users(id);


ALTER TABLE ONLY public.files
    ADD CONSTRAINT "FK_b3c17c323fdc479a109e517f138" FOREIGN KEY (project_id) REFERENCES public.projects(id);



ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT "FK_b4eae643df5fbd98341faf65ed7" FOREIGN KEY (milestone_id) REFERENCES public.milestones(id);


ALTER TABLE ONLY public.message_attachments
    ADD CONSTRAINT "FK_bf65c3db8657cef6197b68b8c88" FOREIGN KEY (message_id) REFERENCES public.messages(id);


ALTER TABLE ONLY public.projects
    ADD CONSTRAINT "FK_c1345700580c6c6b17200647bcc" FOREIGN KEY (category_id) REFERENCES public.project_categories(id);



ALTER TABLE ONLY public.projects
    ADD CONSTRAINT "FK_ca29f959102228649e714827478" FOREIGN KEY (client_id) REFERENCES public.users(id);


ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT "FK_d0a95ef8a28188364c546eb65c1" FOREIGN KEY (user_id) REFERENCES public.users(id);

ALTER TABLE ONLY public.disputes
    ADD CONSTRAINT "FK_e1daaf67c744732e0d7109ea2a2" FOREIGN KEY (reported_by) REFERENCES public.users(id);

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT "FK_e8707e0813b6410b611815d19da" FOREIGN KEY (assigned_freelancer_id) REFERENCES public.users(id);

ALTER TABLE ONLY public.user_skills
    ADD CONSTRAINT "FK_eb69710b0a00f42fb95fc2ac2f5" FOREIGN KEY (skill_id) REFERENCES public.skills(id);
