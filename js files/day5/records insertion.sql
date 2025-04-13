use day_5_nodejs;
select * from genres;
ALTER TABLE books DROP FOREIGN KEY books_ibfk_1;
ALTER TABLE books DROP FOREIGN KEY books_ibfk_2;

ALTER TABLE books
ADD CONSTRAINT fk_books_author
FOREIGN KEY (author_id) REFERENCES authors(id)
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE books
ADD CONSTRAINT fk_books_genre
FOREIGN KEY (genre_id) REFERENCES genres(id)
ON DELETE CASCADE
ON UPDATE CASCADE;



INSERT INTO authors (name, country, birth_year) VALUES
('chetan bhagat', 'india', 1974),
('amish tripathi', 'india', 1974),
('arundhati roy', 'india', 1961),
('sudha murthy', 'india', 1950),
('rk narayan', 'india', 1906);


INSERT INTO genres (name, description) VALUES
('mythology', 'based on indian epics and deities'),
('romance', 'indian love and relationships'),
('fiction', 'indian contemporary fiction'),
('biography', 'life stories of indian personalities'),
('children', 'stories for indian kids');


INSERT INTO books (title, author_id, genre_id, published_year, price) VALUES
('the immortals of meluha', 2, 1, 2010, 250.00),
('half girlfriend', 1, 2, 2014, 200.00),
('the god of small things', 3, 3, 1997, 350.00),
('wise and otherwise', 4, 4, 2002, 180.00),
('swami and friends', 5, 5, 1935, 160.00);


INSERT INTO users (name, email, age, created_at) VALUES
('rahul verma', 'rahul@example.com', 25, '2023-11-10'),
('ananya singh', 'ananya@example.com', 22, '2024-01-15'),
('vishal kumar', 'vishal@example.com', 28, '2023-12-05'),
('priya mehra', 'priya@example.com', 24, '2024-03-01'),
('arjun nair', 'arjun@example.com', 26, '2023-10-20');

  alter table genres rename column id to genre_id;
  alter table authors rename column id to author_id;
  alter table books rename column id to book_id;
alter table users rename column id to user_id;

select * from users;


-- list all books with author and genre names
select book_id,title,published_year,price,b.author_id,a.name,g.genre_id,g.name from books b 
join authors a on b.author_id=a.author_id
join genres g on b.genre_id=g.genre_id;

