# --- Created by Ebean DDL
# To stop Ebean DDL generation, remove this comment and start using Evolutions

# --- !Ups

create table account (
  id                        bigint auto_increment not null,
  creation_date             datetime not null,
  last_update               datetime not null,
  last_name                 varchar(255),
  first_name                varchar(255),
  email                     varchar(255) not null,
  password                  varchar(255) not null,
  constraint uq_account_email unique (email),
  constraint pk_account primary key (id))
;

create table bet (
  id                        bigint auto_increment not null,
  creation_date             datetime not null,
  last_update               datetime not null,
  account_id                bigint,
  stock_id                  bigint,
  start_date                datetime not null,
  target_date               datetime not null,
  target                    double not null,
  constraint pk_bet primary key (id))
;

create table company (
  id                        bigint auto_increment not null,
  creation_date             datetime not null,
  last_update               datetime not null,
  name                      varchar(255) not null,
  symbol                    varchar(255) not null,
  industry_id               bigint,
  constraint uq_company_symbol unique (symbol),
  constraint pk_company primary key (id))
;

create table currency (
  id                        bigint auto_increment not null,
  creation_date             datetime not null,
  last_update               datetime not null,
  name                      varchar(255),
  symbol                    varchar(255),
  constraint uq_currency_name unique (name),
  constraint pk_currency primary key (id))
;

create table currency_exchange (
  id                        bigint auto_increment not null,
  creation_date             datetime not null,
  last_update               datetime not null,
  reference_id              bigint not null,
  currency_id               bigint not null,
  last_loading              datetime not null,
  constraint pk_currency_exchange primary key (id))
;

create table currency_exchange_value (
  id                        bigint auto_increment not null,
  date                      datetime not null,
  currency_exchange_id      bigint,
  value                     double not null,
  constraint uq_currency_exchange_value_1 unique (currency_exchange_id,date),
  constraint pk_currency_exchange_value primary key (id))
;

create table industry (
  id                        bigint auto_increment not null,
  creation_date             datetime not null,
  last_update               datetime not null,
  name                      varchar(255) not null,
  reference                 integer not null,
  sector_id                 bigint,
  constraint uq_industry_reference unique (reference),
  constraint pk_industry primary key (id))
;

create table market (
  id                        bigint auto_increment not null,
  creation_date             datetime not null,
  last_update               datetime not null,
  name                      varchar(255),
  symbol                    varchar(255) not null,
  google_symbol             varchar(255),
  constraint uq_market_symbol unique (symbol),
  constraint pk_market primary key (id))
;

create table sector (
  id                        bigint auto_increment not null,
  creation_date             datetime not null,
  last_update               datetime not null,
  name                      varchar(255) not null,
  constraint uq_sector_name unique (name),
  constraint pk_sector primary key (id))
;

create table share (
  id                        bigint auto_increment not null,
  creation_date             datetime not null,
  last_update               datetime not null,
  account_id                bigint,
  stock_id                  bigint,
  number                    integer not null,
  build_date                datetime not null,
  build_price               double not null,
  sell_date                 datetime,
  sell_price                double,
  constraint pk_share primary key (id))
;

create table stock (
  id                        bigint auto_increment not null,
  creation_date             datetime not null,
  last_update               datetime not null,
  name                      varchar(255),
  description               TEXT,
  symbol                    varchar(255),
  from_date                 datetime,
  last_loading              DATETIME default "1970-01-01 00:00:01" not null,
  market_id                 bigint,
  currency_id               bigint,
  company_id                bigint,
  constraint uq_stock_symbol unique (symbol),
  constraint pk_stock primary key (id))
;

create table stock_historical_view (
  id                        bigint auto_increment not null,
  creation_date             datetime not null,
  last_update               datetime not null,
  account_id                bigint,
  stock_id                  bigint,
  constraint pk_stock_historical_view primary key (id))
;

create table stock_value (
  id                        bigint auto_increment not null,
  date                      datetime,
  stock_id                  bigint,
  open_value                double,
  close_value               double,
  value_max                 double,
  value_min                 double,
  volume                    double,
  constraint pk_stock_value primary key (id))
;

create table survey (
  id                        bigint auto_increment not null,
  creation_date             datetime not null,
  last_update               datetime not null,
  account_id                bigint,
  stock_id                  bigint,
  start_date                datetime not null,
  end_date                  datetime,
  constraint pk_survey primary key (id))
;

alter table bet add constraint fk_bet_account_1 foreign key (account_id) references account (id) on delete restrict on update restrict;
create index ix_bet_account_1 on bet (account_id);
alter table bet add constraint fk_bet_stock_2 foreign key (stock_id) references stock (id) on delete restrict on update restrict;
create index ix_bet_stock_2 on bet (stock_id);
alter table company add constraint fk_company_industry_3 foreign key (industry_id) references industry (id) on delete restrict on update restrict;
create index ix_company_industry_3 on company (industry_id);
alter table currency_exchange add constraint fk_currency_exchange_reference_4 foreign key (reference_id) references currency (id) on delete restrict on update restrict;
create index ix_currency_exchange_reference_4 on currency_exchange (reference_id);
alter table currency_exchange add constraint fk_currency_exchange_currency_5 foreign key (currency_id) references currency (id) on delete restrict on update restrict;
create index ix_currency_exchange_currency_5 on currency_exchange (currency_id);
alter table currency_exchange_value add constraint fk_currency_exchange_value_currencyExchange_6 foreign key (currency_exchange_id) references currency_exchange (id) on delete restrict on update restrict;
create index ix_currency_exchange_value_currencyExchange_6 on currency_exchange_value (currency_exchange_id);
alter table industry add constraint fk_industry_sector_7 foreign key (sector_id) references sector (id) on delete restrict on update restrict;
create index ix_industry_sector_7 on industry (sector_id);
alter table share add constraint fk_share_account_8 foreign key (account_id) references account (id) on delete restrict on update restrict;
create index ix_share_account_8 on share (account_id);
alter table share add constraint fk_share_stock_9 foreign key (stock_id) references stock (id) on delete restrict on update restrict;
create index ix_share_stock_9 on share (stock_id);
alter table stock add constraint fk_stock_market_10 foreign key (market_id) references market (id) on delete restrict on update restrict;
create index ix_stock_market_10 on stock (market_id);
alter table stock add constraint fk_stock_currency_11 foreign key (currency_id) references currency (id) on delete restrict on update restrict;
create index ix_stock_currency_11 on stock (currency_id);
alter table stock add constraint fk_stock_company_12 foreign key (company_id) references company (id) on delete restrict on update restrict;
create index ix_stock_company_12 on stock (company_id);
alter table stock_historical_view add constraint fk_stock_historical_view_account_13 foreign key (account_id) references account (id) on delete restrict on update restrict;
create index ix_stock_historical_view_account_13 on stock_historical_view (account_id);
alter table stock_historical_view add constraint fk_stock_historical_view_stock_14 foreign key (stock_id) references stock (id) on delete restrict on update restrict;
create index ix_stock_historical_view_stock_14 on stock_historical_view (stock_id);
alter table stock_value add constraint fk_stock_value_stock_15 foreign key (stock_id) references stock (id) on delete restrict on update restrict;
create index ix_stock_value_stock_15 on stock_value (stock_id);
alter table survey add constraint fk_survey_account_16 foreign key (account_id) references account (id) on delete restrict on update restrict;
create index ix_survey_account_16 on survey (account_id);
alter table survey add constraint fk_survey_stock_17 foreign key (stock_id) references stock (id) on delete restrict on update restrict;
create index ix_survey_stock_17 on survey (stock_id);



# --- !Downs

SET FOREIGN_KEY_CHECKS=0;

drop table account;

drop table bet;

drop table company;

drop table currency;

drop table currency_exchange;

drop table currency_exchange_value;

drop table industry;

drop table market;

drop table sector;

drop table share;

drop table stock;

drop table stock_historical_view;

drop table stock_value;

drop table survey;

SET FOREIGN_KEY_CHECKS=1;

