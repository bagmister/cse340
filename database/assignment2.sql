INSERT INTO public.account (account_firstname, account_lastname, account_email, account_password) 
	Values
	('Tony','Stark','tony@starkent.com','Iam1ronM@n'),
    ('Bob','Billy','bob@thefight.com','Iam1ronM@n'),
    ('Billy','Bob','billy@thefight.com','Iam1ronM@n'),
    ('Bio','Poopie','bio@unknown.com','Iam1ronM@n'),
    ('Bilbo','Baggins','bilbo@lotr.com','Iam1ronM@n'),
    ('Frodo','Baggins','frodo@lotr.com','Iam1ronM@n'),
    ('Gandalf','The Gray','pillgrim@lotr.com','Iam1ronM@n');

UPDATE public.account
SET account_type = 'Admin'
where account_id = 1;

Delete FROM public.account
WHERE account_id = 1;

UPDATE public.inventory
SET inv_description = REPLACE(inv_description, 'small interiors','a huge interior');

Select *
From public.inventory i
INNER JOIN public.classification c
	ON i.classification_id = c.classification_id
Where i.classification_id = 2

UPDATE public.inventory
SET inv_thumbnail = REPLACE(inv_thumbnail, '/images/','/images/vehicles/'),
 inv_image = REPLACE(inv_image, '/images/','/images/vehicles/');