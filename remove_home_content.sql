-- SQL script to remove the home/content record from the page_contents table
DELETE FROM page_contents WHERE page_name = 'home' AND section_name = 'content';
