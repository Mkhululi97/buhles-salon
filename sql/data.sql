-- Add insert scripts here
INSERT INTO salon_schema.treatment (type,code,price) 
VALUES 
('Pedicure','pedi',175), 
('Manicure','mani',215),
('Makeup','make',185.00),
('Brows and Lashes','brolash',240.00)
INSERT INTO salon_schema.stylist (first_name,last_name,phone_number,commission_percentage) 
VALUES 
('Karabo', 'Jobe', '089 889 7878', 0.15),
('Nthaby', 'Mjekelo', '071 589 2348', 0.07),
('Ntombi', 'Maja', '078 812 7878', 0.1)
INSERT INTO salon_schema.client (first_name,last_name,phone_number) 
VALUES 
('Sara','Futho','078 452 0447'),
('Mbali','Mdlalose','078 322 2534'),
('Simpiwe','Nxumalo','081 152 2337'),
('Thembelihle','Ngubane','061 523 3147'),
('Dudu','Nkosi','066 234 2437'),
('Lwazi','Ndlovu','084 313 0137'),
('Nthabiseng','Nketsi','087 481 4787')
