-- ========================================================
-- OPTIONAL DEMO ITEMS FOR POHELA BOISHAK APPLICATION
-- ========================================================
-- 
-- This file contains sample food items for the Pohela Boishak
-- event stall. Use this ONLY if you want to pre-populate
-- the database with demo items.
--
-- To load these items:
--   psql -U postgres -d pohela_boishakh -f demo-items.sql
--
-- After loading, you can delete items from the admin panel
-- or add your own items through the admin dashboard.
-- ========================================================

-- Food Items
INSERT INTO food_items (name, description, price, category, image_url, sort_order) VALUES
('কেক', 'তাজা এবং সুস্বাদু হোমমেড কেক, নববর্ষের বিশেষ স্বাদে তৈরি।', 80.00, 'খাবার', 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop', 1),
('ফ্লেভার্ড রসগোল্লা', 'বিভিন্ন ফ্লেভারে ভরা রসালো রসগোল্লা, মিষ্টি প্রেমীদের জন্য।', 50.00, 'খাবার', 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&h=400&fit=crop', 2),
('মালাই পাটিসাপটা', 'ক্রিমি মালাই দিয়ে ভরা ঐতিহ্যবাহী পাটিসাপটা পিঠা।', 60.00, 'খাবার', 'https://images.unsplash.com/photo-1488477181946-c5e63c8686c6?w=400&h=400&fit=crop', 3),
('ফুলঝুরি পিঠা', 'খাস্তা এবং মচমচে ফুলঝুরি পিঠা, চায়ের সাথে পারফেক্ট।', 40.00, 'খাবার', 'https://images.unsplash.com/photo-1586985289688-cacf0e04a778?w=400&h=400&fit=crop', 4),
('টিরামিসু', 'ইতালিয়ান স্টাইলে তৈরি প্রিমিয়াম টিরামিসু ডেজার্ট।', 120.00, 'খাবার', 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=400&h=400&fit=crop', 5),
('ওভেন বেক পাস্তা', 'চিজি এবং ক্রিমি ওভেন বেকড পাস্তা, গরম গরম পরিবেশন।', 150.00, 'খাবার', 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&h=400&fit=crop', 6),
('ভেলপুরি', 'ট্যাঙ্গি এবং স্পাইসি ভেলপুরি, স্ট্রিট ফুড লাভারদের পছন্দ।', 30.00, 'খাবার', 'https://images.unsplash.com/photo-1594007759138-53d098b4251c?w=400&h=400&fit=crop', 7),
('পাঁপড় ভাজা', 'কুড়মুড়ে এবং মচমচে পাঁপড় ভাজা, হালকা স্ন্যাকস।', 20.00, 'খাবার', 'https://images.unsplash.com/photo-1618164436241-4473940571cd?w=400&h=400&fit=crop', 8),
('নকশী পিঠা', 'হাতে তৈরি সুন্দর নকশী পিঠা, বাঙালি ঐতিহ্যের প্রতীক।', 70.00, 'খাবার', 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&h=400&fit=crop', 9),
('নিমকি', 'ঝরঝরে এবং মচমচে নিমকি, নোনতা স্ন্যাকস প্রেমীদের জন্য।', 25.00, 'খাবার', 'https://images.unsplash.com/photo-1599599810694-b5ac4dd6b696?w=400&h=400&fit=crop', 10),
('ফ্রেঞ্চ ফ্রাই', 'গোল্ডেন ক্রিস্পি ফ্রেঞ্চ ফ্রাই, সস সহ পরিবেশন।', 60.00, 'খাবার', 'https://images.unsplash.com/photo-1585238341710-4edd9a20922e?w=400&h=400&fit=crop', 11),
('সুজির বরফি', 'ঘি দিয়ে তৈরি মিষ্টি সুজির বরফি, মুখে গলে যায়।', 40.00, 'খাবার', 'https://images.unsplash.com/photo-1599599810694-b5ac4dd6b696?w=400&h=400&fit=crop', 12),
('মুড়ির মোয়া ও নাড়ু', 'ঐতিহ্যবাহী মুড়ির মোয়া এবং নারকেল নাড়ু, দুটোই একসাথে।', 30.00, 'খাবার', 'https://images.unsplash.com/photo-1599599810694-b5ac4dd6b696?w=400&h=400&fit=crop', 13);

-- Juice Items
INSERT INTO food_items (name, description, price, category, image_url, sort_order) VALUES
('কোল্ড কফি', 'ক্রিমি এবং ঠান্ডা কোল্ড কফি, গরমে প্রাণ জুড়ায়।', 80.00, 'জুস', 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=400&h=400&fit=crop', 14),
('ব্লু মোহিত', 'রিফ্রেশিং ব্লু কালারের ঠান্ডা মোহিত ড্রিংক।', 70.00, 'জুস', 'https://images.unsplash.com/photo-1553530666-ba2a8e36d8a3?w=400&h=400&fit=crop', 15),
('ফালুদা', 'রোজ সিরাপ, দুধ, জেলি ও আইসক্রিম দিয়ে ক্লাসিক ফালুদা।', 100.00, 'জুস', 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=400&h=400&fit=crop', 16),
('লেমন মিন্ট', 'তাজা লেবু এবং পুদিনা পাতার শীতল পানীয়।', 50.00, 'জুস', 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=400&fit=crop', 17);

-- Combo Items
INSERT INTO food_items (name, description, price, category, image_url, combo_items, sort_order) VALUES
('বৈশাখী কম্বো প্লেট', 'নববর্ষের বিশেষ কম্বো — ভেলপুরি, নিমকি, ফুলঝুরি পিঠা এবং লেমন মিন্ট একসাথে। আলাদা কিনলে ১৪৫৳, কম্বোতে মাত্র ১২০৳!', 120.00, 'কম্বো', 'https://images.unsplash.com/photo-1605521209474-5fdfb1c381bc?w=400&h=400&fit=crop', ARRAY['ভেলপুরি', 'নিমকি', 'ফুলঝুরি পিঠা', 'লেমন মিন্ট'], 18);

-- Other Items (Stall Activities & Crafts)
INSERT INTO food_items (name, description, price, category, image_url, sort_order) VALUES
('লটারি', 'ভাগ্য পরীক্ষা করুন! উত্তেজনাপূর্ণ পুরস্কার জিতে নিন।', 20.00, 'অন্যান্য', 'https://images.unsplash.com/photo-1627873649563-91df60c5a0df?w=400&h=400&fit=crop', 19),
('হ্যান্ডমেড জুয়েলারী', 'হাতে তৈরি অনন্য এবং সুন্দর জুয়েলারী কালেকশন।', 150.00, 'অন্যান্য', 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=400&fit=crop', 20),
('বায়োস্কোপ', 'নস্টালজিক বায়োস্কোপ অভিজ্ঞতা, চোখ রাখুন আর দেখুন।', 10.00, 'অন্যান্য', 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=400&h=400&fit=crop', 21),
('ক্যানভাস', 'হাতে আঁকা শৈল্পিক ক্যানভাস আর্ট, ঘর সাজানোর জন্য।', 200.00, 'অন্যান্য', 'https://images.unsplash.com/photo-1578168745944-4f2d6b8f8e6f?w=400&h=400&fit=crop', 22),
('বার্মিস আচার', 'ঝাল-মিষ্টি বার্মিস স্টাইলের ট্র্যাডিশনাল আচার।', 80.00, 'অন্যান্য', 'https://images.unsplash.com/photo-1599599810694-b5ac4dd6b696?w=400&h=400&fit=crop', 23),
('মাটির জিনিসপত্র', 'শিল্পীদের হাতে তৈরি মাটির তৈজসপত্র ও শোপিস।', 100.00, 'অন্যান্য', 'https://images.unsplash.com/photo-1578500494198-246f612d03b3?w=400&h=400&fit=crop', 24),
('কি রিং', 'ইউনিক ডিজাইনের কাস্টম কি রিং, গিফট হিসেবে পারফেক্ট।', 30.00, 'অন্যান্য', 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=400&fit=crop', 25),
('মুখোশ', 'রঙিন এবং ঐতিহ্যবাহী নববর্ষের মুখোশ।', 50.00, 'অন্যান্য', 'https://images.unsplash.com/photo-1577720643272-265cbb49a882?w=400&h=400&fit=crop', 26),
('নববর্ষের আলপনা (হাতে বা গালে)', 'পেশাদার শিল্পীর হাতে সুন্দর আলপনা আর্ট, হাতে বা গালে।', 30.00, 'অন্যান্য', 'https://images.unsplash.com/photo-1540879295612-760a05b65f84?w=400&h=400&fit=crop', 27);

-- ========================================================
-- Demo items loaded successfully!
-- You can now start adding orders and managing inventory
-- through the admin dashboard.
-- ========================================================
