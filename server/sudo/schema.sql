 DROP TABLE IF EXISTS todos;

CREATE TABLE todos (
    "id"            serial PRIMARY KEY NOT NULL,
    "title"         varchar(128) NOT NULL,
    "completed"     boolean DEFAULT FALSE NOT NULL,
    "create_time"   timestamp WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_time"   timestamp WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

/* insert into todos ("order", completed, title) VALUES (1, FALSE, 'Fisk'); */
