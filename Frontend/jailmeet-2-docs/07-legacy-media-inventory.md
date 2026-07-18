# JailMeet Legacy Media Inventory

Generated from read-only analysis of `C:\xampp\htdocs\Project\JailMeet` on 2026-07-07. No media files were copied and no PHP/HTML/CSS/JS files were modified.

## Summary

- Old project root: `C:\xampp\htdocs\Project\JailMeet`
- New project root for planned migration: `C:\Users\afsal\OneDrive\Desktop\JailMeet2.0`
- Legacy SQL used for schema analysis: `C:\xampp\htdocs\Project\jailmeet.sql` (note: jailmeet.sql was not inside the old project root)
- Media files found: 1352 total; 1351 images; 1 videos; 0 documents
- Media folders found: 73
- Main migration candidates: `C:\xampp\htdocs\Project\JailMeet\officer\uploads` and `C:\xampp\htdocs\Project\JailMeet\uploads`.

## Known Likely Folders Check

| Requested folder | Exists? | Media count | Classification | Note |
| --- | --- | ---: | --- | --- |
| `C:\xampp\htdocs\Project\JailMeet\uploads` | True | 3 | USER-UPLOADED candidate | General uploaded image folder found on disk; no PHP references found in current code |
| `C:\xampp\htdocs\Project\JailMeet\officer\uploads` | True | 19 | USER-UPLOADED candidate | Prisoner profile photos referenced by prisoner.dp |
| `C:\xampp\htdocs\Project\JailMeet\officer\uploads\profilepics` | False | 0 | Missing | Folder path does not exist |
| `C:\xampp\htdocs\Project\JailMeet\visitor\profilepics` | True | 0 | USER-UPLOADED candidate | Exists but no matching media files found |
| `C:\xampp\htdocs\Project\JailMeet\assets\img` | True | 42 | STATIC TEMPLATE | Theme/vendor/static UI assets |
| `C:\xampp\htdocs\Project\JailMeet\admin\assets` | True | 42 | STATIC TEMPLATE | Static UI/media assets |
| `C:\xampp\htdocs\Project\JailMeet\visitor\visitorpage\assets` | True | 45 | STATIC TEMPLATE | Theme/vendor/static UI assets |

## All Media Folders Found

| Folder | Count | Extensions | Classification | Purpose | Should migrate? |
| --- | ---: | --- | --- | --- | --- |
| `C:\xampp\htdocs\Project\JailMeet` | 14 | .jpeg: 4, .jpg: 7, .mp4: 1, .png: 2 | STATIC TEMPLATE / BRAND / DEMO | Landing page, brand, team, demo video assets | no |
| `C:\xampp\htdocs\Project\JailMeet\admin` | 3 | .jpg: 1, .png: 2 | STATIC TEMPLATE | Static UI/media assets | no |
| `C:\xampp\htdocs\Project\JailMeet\admin\assets\img` | 16 | .jpg: 12, .png: 3, .webp: 1 | STATIC TEMPLATE | Theme/vendor/static UI assets | no |
| `C:\xampp\htdocs\Project\JailMeet\admin\assets\img\clients` | 6 | .png: 6 | STATIC TEMPLATE | Theme/vendor/static UI assets | no |
| `C:\xampp\htdocs\Project\JailMeet\admin\assets\img\portfolio` | 12 | .jpg: 12 | STATIC TEMPLATE | Theme/vendor/static UI assets | no |
| `C:\xampp\htdocs\Project\JailMeet\admin\assets\img\team` | 3 | .jpg: 3 | STATIC TEMPLATE | Theme/vendor/static UI assets | no |
| `C:\xampp\htdocs\Project\JailMeet\admin\assets\img\testimonials` | 5 | .jpg: 5 | STATIC TEMPLATE | Theme/vendor/static UI assets | no |
| `C:\xampp\htdocs\Project\JailMeet\admin\assets1\fonts\fontawesome` | 3 | .svg: 3 | STATIC TEMPLATE | Theme/vendor/static UI assets | no |
| `C:\xampp\htdocs\Project\JailMeet\admin\assets1\fonts\simple-line-icons` | 1 | .svg: 1 | STATIC TEMPLATE | Theme/vendor/static UI assets | no |
| `C:\xampp\htdocs\Project\JailMeet\admin\assets1\img` | 15 | .jpeg: 1, .jpg: 9, .png: 1, .svg: 4 | STATIC TEMPLATE | Theme/vendor/static UI assets | no |
| `C:\xampp\htdocs\Project\JailMeet\admin\assets1\img\examples` | 39 | .jpeg: 15, .jpg: 20, .svg: 4 | STATIC TEMPLATE | Theme/vendor/static UI assets | no |
| `C:\xampp\htdocs\Project\JailMeet\admin\assets1\img\flags` | 247 | .png: 247 | STATIC TEMPLATE | Theme/vendor/static UI assets | no |
| `C:\xampp\htdocs\Project\JailMeet\admin\assets1\img\kaiadmin` | 19 | .ico: 1, .png: 14, .svg: 4 | STATIC TEMPLATE | Theme/vendor/static UI assets | no |
| `C:\xampp\htdocs\Project\JailMeet\admin\assets1\img\undraw` | 12 | .svg: 12 | STATIC TEMPLATE | Theme/vendor/static UI assets | no |
| `C:\xampp\htdocs\Project\JailMeet\admin\assets1\js\plugin\owl-carousel` | 2 | .gif: 1, .png: 1 | STATIC TEMPLATE | Theme/vendor/static UI assets | no |
| `C:\xampp\htdocs\Project\JailMeet\assets\img` | 16 | .jpg: 12, .png: 3, .webp: 1 | STATIC TEMPLATE | Theme/vendor/static UI assets | no |
| `C:\xampp\htdocs\Project\JailMeet\assets\img\clients` | 6 | .png: 6 | STATIC TEMPLATE | Theme/vendor/static UI assets | no |
| `C:\xampp\htdocs\Project\JailMeet\assets\img\portfolio` | 12 | .jpg: 12 | STATIC TEMPLATE | Theme/vendor/static UI assets | no |
| `C:\xampp\htdocs\Project\JailMeet\assets\img\team` | 3 | .jpg: 3 | STATIC TEMPLATE | Theme/vendor/static UI assets | no |
| `C:\xampp\htdocs\Project\JailMeet\assets\img\testimonials` | 5 | .jpg: 5 | STATIC TEMPLATE | Theme/vendor/static UI assets | no |
| `C:\xampp\htdocs\Project\JailMeet\officer` | 1 | .png: 1 | STATIC TEMPLATE | Static UI/media assets | no |
| `C:\xampp\htdocs\Project\JailMeet\officer\assets\img` | 16 | .jpg: 12, .png: 3, .webp: 1 | STATIC TEMPLATE | Theme/vendor/static UI assets | no |
| `C:\xampp\htdocs\Project\JailMeet\officer\assets\img\clients` | 6 | .png: 6 | STATIC TEMPLATE | Theme/vendor/static UI assets | no |
| `C:\xampp\htdocs\Project\JailMeet\officer\assets\img\portfolio` | 12 | .jpg: 12 | STATIC TEMPLATE | Theme/vendor/static UI assets | no |
| `C:\xampp\htdocs\Project\JailMeet\officer\assets\img\team` | 3 | .jpg: 3 | STATIC TEMPLATE | Theme/vendor/static UI assets | no |
| `C:\xampp\htdocs\Project\JailMeet\officer\assets\img\testimonials` | 5 | .jpg: 5 | STATIC TEMPLATE | Theme/vendor/static UI assets | no |
| `C:\xampp\htdocs\Project\JailMeet\officer\src\fonts\dropways` | 1 | .svg: 1 | STATIC TEMPLATE | Theme/vendor/static UI assets | no |
| `C:\xampp\htdocs\Project\JailMeet\officer\src\fonts\font-awesome\fonts` | 1 | .svg: 1 | STATIC TEMPLATE | Theme/vendor/static UI assets | no |
| `C:\xampp\htdocs\Project\JailMeet\officer\src\fonts\foundation-icons` | 1 | .svg: 1 | STATIC TEMPLATE | Theme/vendor/static UI assets | no |
| `C:\xampp\htdocs\Project\JailMeet\officer\src\fonts\ionicons-master\fonts` | 1 | .svg: 1 | STATIC TEMPLATE | Theme/vendor/static UI assets | no |
| `C:\xampp\htdocs\Project\JailMeet\officer\src\fonts\themify-icons\fonts` | 1 | .svg: 1 | STATIC TEMPLATE | Theme/vendor/static UI assets | no |
| `C:\xampp\htdocs\Project\JailMeet\officer\src\images` | 67 | .gif: 1, .jpg: 31, .png: 24, .svg: 11 | STATIC TEMPLATE | Theme/vendor/static UI assets | no |
| `C:\xampp\htdocs\Project\JailMeet\officer\src\images\layout` | 4 | .png: 4 | STATIC TEMPLATE | Theme/vendor/static UI assets | no |
| `C:\xampp\htdocs\Project\JailMeet\officer\src\plugins\datatables\images` | 5 | .png: 5 | STATIC TEMPLATE | Theme/vendor/static UI assets | no |
| `C:\xampp\htdocs\Project\JailMeet\officer\src\plugins\jquery-asColorPicker\dist\images` | 4 | .png: 4 | STATIC TEMPLATE | Theme/vendor/static UI assets | no |
| `C:\xampp\htdocs\Project\JailMeet\officer\src\plugins\plyr\dist` | 1 | .svg: 1 | STATIC TEMPLATE | Theme/vendor/static UI assets | no |
| `C:\xampp\htdocs\Project\JailMeet\officer\uploads` | 19 | .jpeg: 9, .jpg: 10 | USER-UPLOADED | Prisoner profile photos referenced by prisoner.dp | yes |
| `C:\xampp\htdocs\Project\JailMeet\officer\vendors\fonts` | 5 | .svg: 5 | STATIC TEMPLATE | Theme/vendor/static UI assets | no |
| `C:\xampp\htdocs\Project\JailMeet\officer\vendors\images` | 69 | .gif: 1, .jpg: 31, .png: 26, .svg: 11 | STATIC TEMPLATE | Theme/vendor/static UI assets | no |
| `C:\xampp\htdocs\Project\JailMeet\officer\vendors\images\layout` | 4 | .png: 4 | STATIC TEMPLATE | Theme/vendor/static UI assets | no |
| `C:\xampp\htdocs\Project\JailMeet\prisoner\assets\flags\1x1` | 256 | .svg: 256 | STATIC TEMPLATE | Theme/vendor/static UI assets | no |
| `C:\xampp\htdocs\Project\JailMeet\prisoner\assets\flags\4x3` | 256 | .svg: 256 | STATIC TEMPLATE | Theme/vendor/static UI assets | no |
| `C:\xampp\htdocs\Project\JailMeet\prisoner\assets\fonts` | 6 | .svg: 6 | STATIC TEMPLATE | Theme/vendor/static UI assets | no |
| `C:\xampp\htdocs\Project\JailMeet\prisoner\assets\images` | 2 | .ico: 1, .png: 1 | STATIC TEMPLATE | Theme/vendor/static UI assets | no |
| `C:\xampp\htdocs\Project\JailMeet\prisoner\assets\images\bg-themes` | 6 | .png: 6 | STATIC TEMPLATE | Theme/vendor/static UI assets | no |
| `C:\xampp\htdocs\Project\JailMeet\prisoner\assets\images\gallery` | 1 | .svg: 1 | STATIC TEMPLATE | Theme/vendor/static UI assets | no |
| `C:\xampp\htdocs\Project\JailMeet\prisoner\assets\images\timeline` | 9 | .svg: 9 | STATIC TEMPLATE | Theme/vendor/static UI assets | no |
| `C:\xampp\htdocs\Project\JailMeet\prisoner\assets1\img` | 16 | .jpg: 12, .png: 3, .webp: 1 | STATIC TEMPLATE | Theme/vendor/static UI assets | no |
| `C:\xampp\htdocs\Project\JailMeet\prisoner\assets1\img\clients` | 6 | .png: 6 | STATIC TEMPLATE | Theme/vendor/static UI assets | no |
| `C:\xampp\htdocs\Project\JailMeet\prisoner\assets1\img\portfolio` | 12 | .jpg: 12 | STATIC TEMPLATE | Theme/vendor/static UI assets | no |
| `C:\xampp\htdocs\Project\JailMeet\prisoner\assets1\img\team` | 3 | .jpg: 3 | STATIC TEMPLATE | Theme/vendor/static UI assets | no |
| `C:\xampp\htdocs\Project\JailMeet\prisoner\assets1\img\testimonials` | 5 | .jpg: 5 | STATIC TEMPLATE | Theme/vendor/static UI assets | no |
| `C:\xampp\htdocs\Project\JailMeet\prisoner\documentation\assets\blueprint-css\plugins\buttons\icons` | 3 | .png: 3 | STATIC TEMPLATE | Theme/vendor/static UI assets | no |
| `C:\xampp\htdocs\Project\JailMeet\prisoner\documentation\assets\blueprint-css\plugins\link-icons\icons` | 8 | .png: 8 | STATIC TEMPLATE | Theme/vendor/static UI assets | no |
| `C:\xampp\htdocs\Project\JailMeet\prisoner\documentation\assets\blueprint-css\src` | 1 | .png: 1 | STATIC TEMPLATE | Theme/vendor/static UI assets | no |
| `C:\xampp\htdocs\Project\JailMeet\prisoner\documentation\assets\images` | 1 | .png: 1 | STATIC TEMPLATE | Theme/vendor/static UI assets | no |
| `C:\xampp\htdocs\Project\JailMeet\uploads` | 3 | .jpg: 3 | USER-UPLOADED (or orphaned legacy uploads) | General uploaded image folder found on disk; no PHP references found in current code | yes - review; no current DB/PHP reference found |
| `C:\xampp\htdocs\Project\JailMeet\visitor\assets\img` | 16 | .jpg: 12, .png: 3, .webp: 1 | STATIC TEMPLATE | Theme/vendor/static UI assets | no |
| `C:\xampp\htdocs\Project\JailMeet\visitor\assets\img\clients` | 6 | .png: 6 | STATIC TEMPLATE | Theme/vendor/static UI assets | no |
| `C:\xampp\htdocs\Project\JailMeet\visitor\assets\img\portfolio` | 12 | .jpg: 12 | STATIC TEMPLATE | Theme/vendor/static UI assets | no |
| `C:\xampp\htdocs\Project\JailMeet\visitor\assets\img\team` | 3 | .jpg: 3 | STATIC TEMPLATE | Theme/vendor/static UI assets | no |
| `C:\xampp\htdocs\Project\JailMeet\visitor\assets\img\testimonials` | 5 | .jpg: 5 | STATIC TEMPLATE | Theme/vendor/static UI assets | no |
| `C:\xampp\htdocs\Project\JailMeet\visitor\visitorpage\assets\img\avatars` | 4 | .png: 4 | STATIC TEMPLATE | Theme/vendor/static UI assets | no |
| `C:\xampp\htdocs\Project\JailMeet\visitor\visitorpage\assets\img\backgrounds` | 1 | .jpg: 1 | STATIC TEMPLATE | Theme/vendor/static UI assets | no |
| `C:\xampp\htdocs\Project\JailMeet\visitor\visitorpage\assets\img\elements` | 13 | .jpg: 13 | STATIC TEMPLATE | Theme/vendor/static UI assets | no |
| `C:\xampp\htdocs\Project\JailMeet\visitor\visitorpage\assets\img\favicon` | 1 | .ico: 1 | STATIC TEMPLATE | Theme/vendor/static UI assets | no |
| `C:\xampp\htdocs\Project\JailMeet\visitor\visitorpage\assets\img\icons\brands` | 10 | .png: 10 | STATIC TEMPLATE | Theme/vendor/static UI assets | no |
| `C:\xampp\htdocs\Project\JailMeet\visitor\visitorpage\assets\img\icons\unicons` | 8 | .png: 8 | STATIC TEMPLATE | Theme/vendor/static UI assets | no |
| `C:\xampp\htdocs\Project\JailMeet\visitor\visitorpage\assets\img\illustrations` | 3 | .png: 3 | STATIC TEMPLATE | Theme/vendor/static UI assets | no |
| `C:\xampp\htdocs\Project\JailMeet\visitor\visitorpage\assets\img\layouts` | 4 | .png: 4 | STATIC TEMPLATE | Theme/vendor/static UI assets | no |
| `C:\xampp\htdocs\Project\JailMeet\visitor\visitorpage\assets\vendor\fonts\boxicons` | 1 | .svg: 1 | STATIC TEMPLATE | Theme/vendor/static UI assets | no |
| `C:\xampp\htdocs\Project\JailMeet\visitor\visitorpage\html` | 3 | .png: 2, .webp: 1 | STATIC TEMPLATE | Static UI/media assets | no |
| `C:\xampp\htdocs\Project\JailMeet\visitor\visitorpage\html\slideshow` | 3 | .jpg: 3 | STATIC TEMPLATE | Static UI/media assets | no |

## All Image Files Found (Grouped By Folder)

### `C:\xampp\htdocs\Project\JailMeet`
- `afzal.jpg` (174990 bytes)
- `ajmal.jpg` (69640 bytes)
- `alan.jpg` (154913 bytes)
- `anaf.jpg` (132225 bytes)
- `images.png` (7926 bytes)
- `jmlogo.png` (18109 bytes)
- `logo.png` (9413 bytes)
- `prison1.jpg` (519191 bytes)
- `prisoner.jpeg` (94814 bytes)
- `prisoner_img1.jpg` (23081 bytes)
- `prisoner2.jpeg` (85605 bytes)
- `prisoner3.jpeg` (73547 bytes)
- `video_thumbnail.jpg` (349239 bytes)

### `C:\xampp\htdocs\Project\JailMeet\admin`
- `adminlogo.jpg` (12808 bytes)
- `default_prisoner.png` (20292 bytes)
- `default_profile.png` (3509 bytes)

### `C:\xampp\htdocs\Project\JailMeet\admin\assets\img`
- `about.jpg` (104176 bytes)
- `about-2.jpg` (100134 bytes)
- `apple-touch-icon.png` (7489 bytes)
- `favicon.png` (1156 bytes)
- `hero-bg.jpg` (252016 bytes)
- `logo.png` (3432 bytes)
- `page-title-bg.webp` (88924 bytes)
- `services.jpg` (54414 bytes)
- `services-1.jpg` (79550 bytes)
- `services-2.jpg` (50649 bytes)
- `services-3.jpg` (55307 bytes)
- `testimonials-bg.jpg` (363004 bytes)
- `working-1.jpg` (122091 bytes)
- `working-2.jpg` (54824 bytes)
- `working-3.jpg` (91314 bytes)
- `working-4.jpg` (98318 bytes)

### `C:\xampp\htdocs\Project\JailMeet\admin\assets\img\clients`
- `client-1.png` (5282 bytes)
- `client-2.png` (4582 bytes)
- `client-3.png` (4707 bytes)
- `client-4.png` (4587 bytes)
- `client-5.png` (5123 bytes)
- `client-6.png` (3450 bytes)

### `C:\xampp\htdocs\Project\JailMeet\admin\assets\img\portfolio`
- `app-1.jpg` (67064 bytes)
- `app-2.jpg` (73871 bytes)
- `app-3.jpg` (42308 bytes)
- `books-1.jpg` (80146 bytes)
- `books-2.jpg` (60824 bytes)
- `books-3.jpg` (91462 bytes)
- `branding-1.jpg` (25514 bytes)
- `branding-2.jpg` (52305 bytes)
- `branding-3.jpg` (77892 bytes)
- `product-1.jpg` (62035 bytes)
- `product-2.jpg` (89298 bytes)
- `product-3.jpg` (20090 bytes)

### `C:\xampp\htdocs\Project\JailMeet\admin\assets\img\team`
- `team-1.jpg` (64386 bytes)
- `team-2.jpg` (34427 bytes)
- `team-3.jpg` (25992 bytes)

### `C:\xampp\htdocs\Project\JailMeet\admin\assets\img\testimonials`
- `testimonials-1.jpg` (39727 bytes)
- `testimonials-2.jpg` (57584 bytes)
- `testimonials-3.jpg` (17247 bytes)
- `testimonials-4.jpg` (20220 bytes)
- `testimonials-5.jpg` (22595 bytes)

### `C:\xampp\htdocs\Project\JailMeet\admin\assets1\fonts\fontawesome`
- `fa-brands-400.svg` (629277 bytes)
- `fa-regular-400.svg` (141405 bytes)
- `fa-solid-900.svg` (624767 bytes)

### `C:\xampp\htdocs\Project\JailMeet\admin\assets1\fonts\simple-line-icons`
- `Simple-Line-Icons.svg` (239045 bytes)

### `C:\xampp\htdocs\Project\JailMeet\admin\assets1\img`
- `arashmil.jpg` (5223 bytes)
- `bg-404.jpeg` (836122 bytes)
- `blogpost.jpg` (64728 bytes)
- `chadengle.jpg` (3849 bytes)
- `img-shadow.png` (26085 bytes)
- `jm_denis.jpg` (3072 bytes)
- `logoproduct.svg` (1943 bytes)
- `logoproduct2.svg` (2669496 bytes)
- `logoproduct3.svg` (3104 bytes)
- `mlane.jpg` (15450 bytes)
- `profile.jpg` (19934 bytes)
- `profile2.jpg` (11365 bytes)
- `sauro.jpg` (3341 bytes)
- `talha.jpg` (2865 bytes)
- `visa.svg` (2336 bytes)

### `C:\xampp\htdocs\Project\JailMeet\admin\assets1\img\examples`
- `example1.jpeg` (55484 bytes)
- `example10.jpeg` (77907 bytes)
- `example10-300x300.jpg` (30770 bytes)
- `example11.jpeg` (91881 bytes)
- `example11-300x300.jpg` (37774 bytes)
- `example12.jpeg` (84041 bytes)
- `example12-300x300.jpg` (40450 bytes)
- `example1-300x300.jpg` (28014 bytes)
- `example2.jpeg` (141153 bytes)
- `example2-300x300.jpg` (57129 bytes)
- `example3.jpeg` (136345 bytes)
- `example3-300x300.jpg` (47299 bytes)
- `example4.jpeg` (90344 bytes)
- `example4-300x300.jpg` (41519 bytes)
- `example5.jpeg` (153185 bytes)
- `example5-300x300.jpg` (60051 bytes)
- `example6.jpeg` (126385 bytes)
- `example6-300x300.jpg` (44738 bytes)
- `example7.jpeg` (135194 bytes)
- `example7-300x300.jpg` (35330 bytes)
- `example8.jpeg` (89649 bytes)
- `example8-300x300.jpg` (26516 bytes)
- `example9.jpeg` (73924 bytes)
- `example9-300x300.jpg` (31053 bytes)
- `logo.svg` (1051 bytes)
- `logo1.svg` (1054 bytes)
- `logo2.svg` (1066 bytes)
- `logoinvoice.svg` (18069 bytes)
- `product1.jpg` (41140 bytes)
- `product10.jpeg` (95472 bytes)
- `product11.jpeg` (77279 bytes)
- `product12.jpeg` (110275 bytes)
- `product2.jpg` (93908 bytes)
- `product3.jpg` (84929 bytes)
- `product4.jpg` (83301 bytes)
- `product5.jpg` (43064 bytes)
- `product6.jpg` (52550 bytes)
- `product7.jpg` (78165 bytes)
- `product8.jpg` (61646 bytes)

### `C:\xampp\htdocs\Project\JailMeet\admin\assets1\img\flags`
- `ad.png` (643 bytes)
- `ae.png` (408 bytes)
- `af.png` (604 bytes)
- `ag.png` (591 bytes)
- `ai.png` (643 bytes)
- `al.png` (600 bytes)
- `am.png` (497 bytes)
- `an.png` (488 bytes)
- `ao.png` (428 bytes)
- `ar.png` (506 bytes)
- `as.png` (647 bytes)
- `at.png` (403 bytes)
- `au.png` (673 bytes)
- `aw.png` (524 bytes)
- `ax.png` (663 bytes)
- `az.png` (589 bytes)
- `ba.png` (593 bytes)
- `bb.png` (585 bytes)
- `bd.png` (504 bytes)
- `be.png` (449 bytes)
- `bf.png` (497 bytes)
- `bg.png` (462 bytes)
- `bh.png` (457 bytes)
- `bi.png` (675 bytes)
- `bj.png` (486 bytes)
- `bm.png` (611 bytes)
- `bn.png` (639 bytes)
- `bo.png` (500 bytes)
- `br.png` (593 bytes)
- `bs.png` (526 bytes)
- `bt.png` (631 bytes)
- `bv.png` (512 bytes)
- `bw.png` (443 bytes)
- `by.png` (514 bytes)
- `bz.png` (600 bytes)
- `ca.png` (628 bytes)
- `catalonia.png` (398 bytes)
- `cc.png` (625 bytes)
- `cd.png` (528 bytes)
- `cf.png` (614 bytes)
- `cg.png` (521 bytes)
- `ch.png` (367 bytes)
- `ci.png` (453 bytes)
- `ck.png` (586 bytes)
- `cl.png` (450 bytes)
- `cm.png` (525 bytes)
- `cn.png` (472 bytes)
- `co.png` (483 bytes)
- `cr.png` (477 bytes)
- `cs.png` (439 bytes)
- `cu.png` (563 bytes)
- `cv.png` (529 bytes)
- `cx.png` (608 bytes)
- `cy.png` (428 bytes)
- `cz.png` (476 bytes)
- `de.png` (545 bytes)
- `dj.png` (572 bytes)
- `dk.png` (495 bytes)
- `dm.png` (620 bytes)
- `do.png` (508 bytes)
- `dz.png` (582 bytes)
- `ec.png` (500 bytes)
- `ee.png` (429 bytes)
- `eg.png` (465 bytes)
- `eh.png` (508 bytes)
- `england.png` (496 bytes)
- `er.png` (653 bytes)
- `es.png` (469 bytes)
- `et.png` (592 bytes)
- `europeanunion.png` (479 bytes)
- `fam.png` (532 bytes)
- `fi.png` (489 bytes)
- `fj.png` (610 bytes)
- `fk.png` (648 bytes)
- `fm.png` (552 bytes)
- `fo.png` (474 bytes)
- `fr.png` (545 bytes)
- `ga.png` (489 bytes)
- `gb.png` (599 bytes)
- `gd.png` (637 bytes)
- `ge.png` (594 bytes)
- `gf.png` (545 bytes)
- `gh.png` (490 bytes)
- `gi.png` (463 bytes)
- `gl.png` (470 bytes)
- `gm.png` (493 bytes)
- `gn.png` (480 bytes)
- `gp.png` (488 bytes)
- `gq.png` (537 bytes)
- `gr.png` (487 bytes)
- `gs.png` (630 bytes)
- `gt.png` (493 bytes)
- `gu.png` (509 bytes)
- `gw.png` (516 bytes)
- `gy.png` (645 bytes)
- `hk.png` (527 bytes)
- `hm.png` (673 bytes)
- `hn.png` (537 bytes)
- `hr.png` (524 bytes)
- `ht.png` (487 bytes)
- `hu.png` (432 bytes)
- `id.png` (430 bytes)
- `ie.png` (481 bytes)
- `il.png` (431 bytes)
- `in.png` (503 bytes)
- `io.png` (658 bytes)
- `iq.png` (515 bytes)
- `ir.png` (512 bytes)
- `is.png` (532 bytes)
- `it.png` (420 bytes)
- `jm.png` (637 bytes)
- `jo.png` (473 bytes)
- `jp.png` (420 bytes)
- `ke.png` (569 bytes)
- `kg.png` (510 bytes)
- `kh.png` (549 bytes)
- `ki.png` (656 bytes)
- `km.png` (577 bytes)
- `kn.png` (604 bytes)
- `kp.png` (561 bytes)
- `kr.png` (592 bytes)
- `kw.png` (486 bytes)
- `ky.png` (643 bytes)
- `kz.png` (616 bytes)
- `la.png` (563 bytes)
- `lb.png` (517 bytes)
- `lc.png` (520 bytes)
- `li.png` (537 bytes)
- `lk.png` (627 bytes)
- `lr.png` (466 bytes)
- `ls.png` (628 bytes)
- `lt.png` (508 bytes)
- `lu.png` (481 bytes)
- `lv.png` (465 bytes)
- `ly.png` (419 bytes)
- `ma.png` (432 bytes)
- `mc.png` (380 bytes)
- `md.png` (566 bytes)
- `me.png` (448 bytes)
- `mg.png` (453 bytes)
- `mh.png` (628 bytes)
- `mk.png` (664 bytes)
- `ml.png` (474 bytes)
- `mm.png` (483 bytes)
- `mn.png` (492 bytes)
- `mo.png` (588 bytes)
- `mp.png` (597 bytes)
- `mq.png` (655 bytes)
- `mr.png` (569 bytes)
- `ms.png` (614 bytes)
- `mt.png` (420 bytes)
- `mu.png` (496 bytes)
- `mv.png` (542 bytes)
- `mw.png` (529 bytes)
- `mx.png` (574 bytes)
- `my.png` (571 bytes)
- `mz.png` (584 bytes)
- `na.png` (647 bytes)
- `nc.png` (591 bytes)
- `ne.png` (537 bytes)
- `nf.png` (602 bytes)
- `ng.png` (482 bytes)
- `ni.png` (508 bytes)
- `nl.png` (453 bytes)
- `no.png` (512 bytes)
- `np.png` (443 bytes)
- `nr.png` (527 bytes)
- `nu.png` (572 bytes)
- `nz.png` (639 bytes)
- `om.png` (478 bytes)
- `pa.png` (519 bytes)
- `pe.png` (397 bytes)
- `pf.png` (498 bytes)
- `pg.png` (593 bytes)
- `ph.png` (538 bytes)
- `pk.png` (569 bytes)
- `pl.png` (374 bytes)
- `pm.png` (689 bytes)
- `pn.png` (657 bytes)
- `pr.png` (556 bytes)
- `ps.png` (472 bytes)
- `pt.png` (554 bytes)
- `pw.png` (550 bytes)
- `py.png` (473 bytes)
- `qa.png` (450 bytes)
- `re.png` (545 bytes)
- `ro.png` (495 bytes)
- `rs.png` (423 bytes)
- `ru.png` (420 bytes)
- `rw.png` (533 bytes)
- `sa.png` (551 bytes)
- `sb.png` (624 bytes)
- `sc.png` (608 bytes)
- `scotland.png` (649 bytes)
- `sd.png` (492 bytes)
- `se.png` (542 bytes)
- `sg.png` (468 bytes)
- `sh.png` (645 bytes)
- `si.png` (510 bytes)
- `sj.png` (512 bytes)
- `sk.png` (562 bytes)
- `sl.png` (436 bytes)
- `sm.png` (502 bytes)
- `sn.png` (532 bytes)
- `so.png` (527 bytes)
- `sr.png` (513 bytes)
- `st.png` (584 bytes)
- `sv.png` (501 bytes)
- `sy.png` (422 bytes)
- `sz.png` (643 bytes)
- `tc.png` (624 bytes)
- `td.png` (570 bytes)
- `tf.png` (527 bytes)
- `tg.png` (562 bytes)
- `th.png` (452 bytes)
- `tj.png` (496 bytes)
- `tk.png` (638 bytes)
- `tl.png` (514 bytes)
- `tm.png` (593 bytes)
- `tn.png` (495 bytes)
- `to.png` (426 bytes)
- `tr.png` (492 bytes)
- `tt.png` (617 bytes)
- `tv.png` (536 bytes)
- `tw.png` (465 bytes)
- `tz.png` (642 bytes)
- `ua.png` (446 bytes)
- `ug.png` (531 bytes)
- `um.png` (571 bytes)
- `us.png` (609 bytes)
- `uy.png` (532 bytes)
- `uz.png` (515 bytes)
- `va.png` (553 bytes)
- `vc.png` (577 bytes)
- `ve.png` (528 bytes)
- `vg.png` (630 bytes)
- `vi.png` (616 bytes)
- `vn.png` (474 bytes)
- `vu.png` (604 bytes)
- `wales.png` (652 bytes)
- `wf.png` (554 bytes)
- `ws.png` (476 bytes)
- `ye.png` (413 bytes)
- `yt.png` (593 bytes)
- `za.png` (642 bytes)
- `zm.png` (500 bytes)
- `zw.png` (574 bytes)

### `C:\xampp\htdocs\Project\JailMeet\admin\assets1\img\kaiadmin`
- `demo1.png` (138037 bytes)
- `demo2.png` (137552 bytes)
- `demo3.png` (134358 bytes)
- `demo4.png` (141223 bytes)
- `demo5.png` (138737 bytes)
- `demo6.png` (122034 bytes)
- `demo7.png` (115994 bytes)
- `demo8.png` (112497 bytes)
- `demo9.png` (122004 bytes)
- `favicon.ico` (4286 bytes)
- `favicon.png` (6397 bytes)
- `favicon.svg` (2304 bytes)
- `icon.png` (10148 bytes)
- `icon.svg` (2340 bytes)
- `logo_dark.png` (9386 bytes)
- `logo_dark.svg` (4828 bytes)
- `logo_documentation.png` (8596 bytes)
- `logo_light.png` (8807 bytes)
- `logo_light.svg` (4872 bytes)

### `C:\xampp\htdocs\Project\JailMeet\admin\assets1\img\undraw`
- `undraw_blank_canvas_3rbb.svg` (21531 bytes)
- `undraw_creative_team_r90h.svg` (11441 bytes)
- `undraw_empty_xct9.svg` (35340 bytes)
- `undraw_Hello_qnas.svg` (12501 bytes)
- `undraw_no_data_qbuo.svg` (6071 bytes)
- `undraw_not_found_60pq.svg` (7006 bytes)
- `undraw_page_not_found_su7k.svg` (21104 bytes)
- `undraw_sign_in_e6hj.svg` (5459 bytes)
- `undraw_tabs_jf82.svg` (14561 bytes)
- `undraw_Taken_if77.svg` (10182 bytes)
- `undraw_update_uxn2.svg` (35013 bytes)
- `undraw_upgrade_06a0.svg` (7018 bytes)

### `C:\xampp\htdocs\Project\JailMeet\admin\assets1\js\plugin\owl-carousel`
- `ajax-loader.gif` (3208 bytes)
- `owl.video.play.png` (4976 bytes)

### `C:\xampp\htdocs\Project\JailMeet\assets\img`
- `about.jpg` (104176 bytes)
- `about-2.jpg` (100134 bytes)
- `apple-touch-icon.png` (7489 bytes)
- `favicon.png` (1156 bytes)
- `hero-bg.jpg` (252016 bytes)
- `logo.png` (3432 bytes)
- `page-title-bg.webp` (88924 bytes)
- `services.jpg` (54414 bytes)
- `services-1.jpg` (79550 bytes)
- `services-2.jpg` (50649 bytes)
- `services-3.jpg` (55307 bytes)
- `testimonials-bg.jpg` (363004 bytes)
- `working-1.jpg` (122091 bytes)
- `working-2.jpg` (54824 bytes)
- `working-3.jpg` (91314 bytes)
- `working-4.jpg` (98318 bytes)

### `C:\xampp\htdocs\Project\JailMeet\assets\img\clients`
- `client-1.png` (5282 bytes)
- `client-2.png` (4582 bytes)
- `client-3.png` (4707 bytes)
- `client-4.png` (4587 bytes)
- `client-5.png` (5123 bytes)
- `client-6.png` (3450 bytes)

### `C:\xampp\htdocs\Project\JailMeet\assets\img\portfolio`
- `app-1.jpg` (67064 bytes)
- `app-2.jpg` (73871 bytes)
- `app-3.jpg` (42308 bytes)
- `books-1.jpg` (80146 bytes)
- `books-2.jpg` (60824 bytes)
- `books-3.jpg` (91462 bytes)
- `branding-1.jpg` (25514 bytes)
- `branding-2.jpg` (52305 bytes)
- `branding-3.jpg` (77892 bytes)
- `product-1.jpg` (62035 bytes)
- `product-2.jpg` (89298 bytes)
- `product-3.jpg` (20090 bytes)

### `C:\xampp\htdocs\Project\JailMeet\assets\img\team`
- `team-1.jpg` (64386 bytes)
- `team-2.jpg` (34427 bytes)
- `team-3.jpg` (25992 bytes)

### `C:\xampp\htdocs\Project\JailMeet\assets\img\testimonials`
- `testimonials-1.jpg` (39727 bytes)
- `testimonials-2.jpg` (57584 bytes)
- `testimonials-3.jpg` (17247 bytes)
- `testimonials-4.jpg` (20220 bytes)
- `testimonials-5.jpg` (22595 bytes)

### `C:\xampp\htdocs\Project\JailMeet\officer`
- `officer.png` (8081 bytes)

### `C:\xampp\htdocs\Project\JailMeet\officer\assets\img`
- `about.jpg` (104176 bytes)
- `about-2.jpg` (100134 bytes)
- `apple-touch-icon.png` (7489 bytes)
- `favicon.png` (1156 bytes)
- `hero-bg.jpg` (252016 bytes)
- `logo.png` (3432 bytes)
- `page-title-bg.webp` (88924 bytes)
- `services.jpg` (54414 bytes)
- `services-1.jpg` (79550 bytes)
- `services-2.jpg` (50649 bytes)
- `services-3.jpg` (55307 bytes)
- `testimonials-bg.jpg` (363004 bytes)
- `working-1.jpg` (122091 bytes)
- `working-2.jpg` (54824 bytes)
- `working-3.jpg` (91314 bytes)
- `working-4.jpg` (98318 bytes)

### `C:\xampp\htdocs\Project\JailMeet\officer\assets\img\clients`
- `client-1.png` (5282 bytes)
- `client-2.png` (4582 bytes)
- `client-3.png` (4707 bytes)
- `client-4.png` (4587 bytes)
- `client-5.png` (5123 bytes)
- `client-6.png` (3450 bytes)

### `C:\xampp\htdocs\Project\JailMeet\officer\assets\img\portfolio`
- `app-1.jpg` (67064 bytes)
- `app-2.jpg` (73871 bytes)
- `app-3.jpg` (42308 bytes)
- `books-1.jpg` (80146 bytes)
- `books-2.jpg` (60824 bytes)
- `books-3.jpg` (91462 bytes)
- `branding-1.jpg` (25514 bytes)
- `branding-2.jpg` (52305 bytes)
- `branding-3.jpg` (77892 bytes)
- `product-1.jpg` (62035 bytes)
- `product-2.jpg` (89298 bytes)
- `product-3.jpg` (20090 bytes)

### `C:\xampp\htdocs\Project\JailMeet\officer\assets\img\team`
- `team-1.jpg` (64386 bytes)
- `team-2.jpg` (34427 bytes)
- `team-3.jpg` (25992 bytes)

### `C:\xampp\htdocs\Project\JailMeet\officer\assets\img\testimonials`
- `testimonials-1.jpg` (39727 bytes)
- `testimonials-2.jpg` (57584 bytes)
- `testimonials-3.jpg` (17247 bytes)
- `testimonials-4.jpg` (20220 bytes)
- `testimonials-5.jpg` (22595 bytes)

### `C:\xampp\htdocs\Project\JailMeet\officer\src\fonts\dropways`
- `dropways.svg` (2164784 bytes)

### `C:\xampp\htdocs\Project\JailMeet\officer\src\fonts\font-awesome\fonts`
- `fontawesome-webfont.svg` (444379 bytes)

### `C:\xampp\htdocs\Project\JailMeet\officer\src\fonts\foundation-icons`
- `foundation-icons.svg` (150535 bytes)

### `C:\xampp\htdocs\Project\JailMeet\officer\src\fonts\ionicons-master\fonts`
- `ionicons.svg` (333834 bytes)

### `C:\xampp\htdocs\Project\JailMeet\officer\src\fonts\themify-icons\fonts`
- `themify.svg` (234269 bytes)

### `C:\xampp\htdocs\Project\JailMeet\officer\src\images`
- `apple-touch-icon.png` (9402 bytes)
- `banner-img.png` (31551 bytes)
- `briefcase.svg` (1452 bytes)
- `cancel.svg` (1141 bytes)
- `caution-sign.png` (1063 bytes)
- `chat-img1.jpg` (3669 bytes)
- `chat-img2.jpg` (3860 bytes)
- `check-mark.png` (480 bytes)
- `check-mark-green.png` (969 bytes)
- `chrome.png` (1367 bytes)
- `coming-soon.png` (5728 bytes)
- `cross.png` (786 bytes)
- `demo.svg` (1758 bytes)
- `deskapp-logo.svg` (4271 bytes)
- `deskapp-logo-white.svg` (4271 bytes)
- `edge.png` (988 bytes)
- `favicon-16x16.png` (460 bytes)
- `favicon-32x32.png` (849 bytes)
- `firefox.png` (1262 bytes)
- `forgot-password.png` (49547 bytes)
- `github.svg` (1901 bytes)
- `icon-Cash.png` (2826 bytes)
- `icon-debit.png` (3446 bytes)
- `icon-online-wallet.png` (4292 bytes)
- `img.jpg` (3267 bytes)
- `img1.jpg` (205379 bytes)
- `img2.jpg` (507630 bytes)
- `img3.jpg` (294956 bytes)
- `img4.jpg` (357635 bytes)
- `img5.jpg` (362163 bytes)
- `internet-explorer.png` (1254 bytes)
- `login-page-img.png` (100618 bytes)
- `logo-icon.png` (961 bytes)
- `menu-icon.svg` (1242 bytes)
- `modal-img1.jpg` (18583 bytes)
- `modal-img2.jpg` (16456 bytes)
- `modal-img3.jpg` (13174 bytes)
- `new-loader.gif` (447186 bytes)
- `opera.png` (958 bytes)
- `page-icon.svg` (666 bytes)
- `person.svg` (1673 bytes)
- `photo1.jpg` (20302 bytes)
- `photo2.jpg` (27295 bytes)
- `photo3.jpg` (23531 bytes)
- `photo4.jpg` (26692 bytes)
- `photo5.jpg` (17351 bytes)
- `photo6.jpg` (18314 bytes)
- `photo7.jpg` (31613 bytes)
- `photo8.jpg` (44245 bytes)
- `photo9.jpg` (30767 bytes)
- `plyr.svg` (3819 bytes)
- `product-1.jpg` (34255 bytes)
- `product-2.jpg` (60612 bytes)
- `product-3.jpg` (37563 bytes)
- `product-4.jpg` (19416 bytes)
- `product-5.jpg` (59466 bytes)
- `product-img1.jpg` (67833 bytes)
- `product-img2.jpg` (67455 bytes)
- `product-img3.jpg` (76260 bytes)
- `product-img4.jpg` (59310 bytes)
- `profile-photo.jpg` (7674 bytes)
- `register-page-img.png` (58478 bytes)
- `safari.png` (1794 bytes)
- `success.png` (1657 bytes)
- `tick.svg` (879 bytes)
- `upload-file-img.jpg` (14160 bytes)
- `wave.png` (7610 bytes)

### `C:\xampp\htdocs\Project\JailMeet\officer\src\images\layout`
- `header-dark.png` (4984 bytes)
- `header-white.png` (5198 bytes)
- `sidebar-dark.png` (3661 bytes)
- `sidebar-white.png` (3482 bytes)

### `C:\xampp\htdocs\Project\JailMeet\officer\src\plugins\datatables\images`
- `sort_asc.png` (160 bytes)
- `sort_asc_disabled.png` (148 bytes)
- `sort_both.png` (201 bytes)
- `sort_desc.png` (158 bytes)
- `sort_desc_disabled.png` (146 bytes)

### `C:\xampp\htdocs\Project\JailMeet\officer\src\plugins\jquery-asColorPicker\dist\images`
- `alpha.png` (3158 bytes)
- `hue.png` (1805 bytes)
- `saturation.png` (14976 bytes)
- `transparent.png` (1233 bytes)

### `C:\xampp\htdocs\Project\JailMeet\officer\src\plugins\plyr\dist`
- `plyr.svg` (3819 bytes)

### `C:\xampp\htdocs\Project\JailMeet\officer\uploads`
- `67fc0bd742bbf_1744571351.jpg` (2109118 bytes)
- `67fc0bfe83573_1744571390.jpg` (673172 bytes)
- `67fc112fd0293_1744572719.jpg` (225566 bytes)
- `67fd23a5af6c4_1744642981.jpg` (2568721 bytes)
- `67fd257436897_1744643444.jpg` (2568721 bytes)
- `67fd25be8a93d_1744643518.jpg` (2109118 bytes)
- `67fd26610d3e9_1744643681.jpg` (1617250 bytes)
- `67fd276c9d9b3_1744643948.jpg` (1617250 bytes)
- `68029632e3417_1744999986.jpeg` (4854 bytes)
- `680296bb21679_1745000123.jpeg` (4854 bytes)
- `6802984c850c7_1745000524.jpeg` (4854 bytes)
- `68029961ad7b5_1745000801.jpeg` (4854 bytes)
- `6802999b9a283_1745000859.jpeg` (4854 bytes)
- `68029a0b7bf60_1745000971.jpeg` (4854 bytes)
- `68029ac86c32e_1745001160.jpeg` (4854 bytes)
- `68029ccfc9916_1745001679.jpeg` (4854 bytes)
- `68111bfb9a04d_christina-wocintechchat-com-L85a1k-XqH8-unsplash.jpg` (3640774 bytes)
- `68111c310beb1_1745951793.jpg` (3640774 bytes)
- `681aee1e2bec8_images (1).jpeg` (6137 bytes)

### `C:\xampp\htdocs\Project\JailMeet\officer\vendors\fonts`
- `dropways.svg` (2164784 bytes)
- `fontawesome-webfont.svg` (444379 bytes)
- `foundation-icons.svg` (150535 bytes)
- `ionicons.svg` (333834 bytes)
- `themify.svg` (234269 bytes)

### `C:\xampp\htdocs\Project\JailMeet\officer\vendors\images`
- `apple-touch-icon.png` (9402 bytes)
- `banner-img.png` (31551 bytes)
- `blue-logo.png` (3230 bytes)
- `briefcase.svg` (1452 bytes)
- `cancel.svg` (792 bytes)
- `caution-sign.png` (788 bytes)
- `chat-img1.jpg` (2579 bytes)
- `chat-img2.jpg` (2839 bytes)
- `check-mark.png` (231 bytes)
- `check-mark-green.png` (695 bytes)
- `chrome.png` (1294 bytes)
- `coming-soon.png` (4447 bytes)
- `cross.png` (420 bytes)
- `demo.svg` (41 bytes)
- `deskapp-logo.svg` (4271 bytes)
- `deskapp-logo-white.svg` (3658 bytes)
- `edge.png` (915 bytes)
- `favicon-16x16.png` (460 bytes)
- `favicon-32x32.png` (849 bytes)
- `firefox.png` (1189 bytes)
- `forgot-password.png` (28814 bytes)
- `github.svg` (1901 bytes)
- `icon-Cash.png` (2826 bytes)
- `icon-debit.png` (3446 bytes)
- `icon-online-wallet.png` (4292 bytes)
- `img.jpg` (2427 bytes)
- `img1.jpg` (205379 bytes)
- `img2.jpg` (507630 bytes)
- `img3.jpg` (294956 bytes)
- `img4.jpg` (357635 bytes)
- `img5.jpg` (362163 bytes)
- `internet-explorer.png` (1180 bytes)
- `login-img.png` (18572 bytes)
- `login-page-img.png` (61719 bytes)
- `logo-icon.png` (961 bytes)
- `menu-icon.svg` (735 bytes)
- `modal-img1.jpg` (17712 bytes)
- `modal-img2.jpg` (15651 bytes)
- `modal-img3.jpg` (12338 bytes)
- `new-loader.gif` (445375 bytes)
- `opera.png` (885 bytes)
- `page-icon.svg` (531 bytes)
- `person.svg` (1673 bytes)
- `photo1.jpg` (19451 bytes)
- `photo2.jpg` (26446 bytes)
- `photo3.jpg` (22673 bytes)
- `photo4.jpg` (25847 bytes)
- `photo5.jpg` (16513 bytes)
- `photo6.jpg` (17461 bytes)
- `photo7.jpg` (30777 bytes)
- `photo8.jpg` (43420 bytes)
- `photo9.jpg` (29923 bytes)
- `plyr.svg` (41 bytes)
- `product-1.jpg` (34255 bytes)
- `product-2.jpg` (60612 bytes)
- `product-3.jpg` (37563 bytes)
- `product-4.jpg` (19416 bytes)
- `product-5.jpg` (59466 bytes)
- `product-img1.jpg` (66980 bytes)
- `product-img2.jpg` (66639 bytes)
- `product-img3.jpg` (75411 bytes)
- `product-img4.jpg` (58467 bytes)
- `profile-photo.jpg` (6882 bytes)
- `register-page-img.png` (58478 bytes)
- `safari.png` (1060 bytes)
- `success.png` (1377 bytes)
- `tick.svg` (879 bytes)
- `upload-file-img.jpg` (13700 bytes)
- `wave.png` (7610 bytes)

### `C:\xampp\htdocs\Project\JailMeet\officer\vendors\images\layout`
- `header-dark.png` (4955 bytes)
- `header-white.png` (5169 bytes)
- `sidebar-dark.png` (3632 bytes)
- `sidebar-white.png` (3453 bytes)

### `C:\xampp\htdocs\Project\JailMeet\prisoner\assets\flags\1x1`
- `ad.svg` (55630 bytes)
- `ae.svg` (273 bytes)
- `af.svg` (33622 bytes)
- `ag.svg` (862 bytes)
- `ai.svg` (58220 bytes)
- `al.svg` (4908 bytes)
- `am.svg` (242 bytes)
- `ao.svg` (2251 bytes)
- `aq.svg` (4611 bytes)
- `ar.svg` (4549 bytes)
- `as.svg` (11530 bytes)
- `at.svg` (247 bytes)
- `au.svg` (1733 bytes)
- `aw.svg` (14194 bytes)
- `ax.svg` (549 bytes)
- `az.svg` (599 bytes)
- `ba.svg` (1719 bytes)
- `bb.svg` (763 bytes)
- `bd.svg` (197 bytes)
- `be.svg` (318 bytes)
- `bf.svg` (447 bytes)
- `bg.svg` (309 bytes)
- `bh.svg` (677 bytes)
- `bi.svg` (1248 bytes)
- `bj.svg` (504 bytes)
- `bl.svg` (305 bytes)
- `bm.svg` (31621 bytes)
- `bn.svg` (22121 bytes)
- `bo.svg` (190560 bytes)
- `bq.svg` (231 bytes)
- `br.svg` (12207 bytes)
- `bs.svg` (646 bytes)
- `bt.svg` (38465 bytes)
- `bv.svg` (635 bytes)
- `bw.svg` (285 bytes)
- `by.svg` (8989 bytes)
- `bz.svg` (76753 bytes)
- `ca.svg` (960 bytes)
- `cc.svg` (4306 bytes)
- `cd.svg` (512 bytes)
- `cf.svg` (679 bytes)
- `cg.svg` (507 bytes)
- `ch.svg` (342 bytes)
- `ci.svg` (305 bytes)
- `ck.svg` (2526 bytes)
- `cl.svg` (653 bytes)
- `cm.svg` (847 bytes)
- `cn.svg` (792 bytes)
- `co.svg` (308 bytes)
- `cr.svg` (320 bytes)
- `cu.svg` (626 bytes)
- `cv.svg` (1651 bytes)
- `cw.svg` (711 bytes)
- `cx.svg` (3504 bytes)
- `cy.svg` (10141 bytes)
- `cz.svg` (493 bytes)
- `de.svg` (245 bytes)
- `dj.svg` (645 bytes)
- `dk.svg` (243 bytes)
- `dm.svg` (20943 bytes)
- `do.svg` (453581 bytes)
- `dz.svg` (327 bytes)
- `ec.svg` (39081 bytes)
- `ee.svg` (359 bytes)
- `eg.svg` (16110 bytes)
- `eh.svg` (1028 bytes)
- `er.svg` (4848 bytes)
- `es.svg` (147117 bytes)
- `es-ct.svg` (260 bytes)
- `et.svg` (1583 bytes)
- `eu.svg` (1278 bytes)
- `fi.svg` (253 bytes)
- `fj.svg` (44170 bytes)
- `fk.svg` (44629 bytes)
- `fm.svg` (941 bytes)
- `fo.svg` (577 bytes)
- `fr.svg` (305 bytes)
- `ga.svg` (316 bytes)
- `gb.svg` (911 bytes)
- `gb-eng.svg` (250 bytes)
- `gb-nir.svg` (35270 bytes)
- `gb-sct.svg` (242 bytes)
- `gb-wls.svg` (14304 bytes)
- `gd.svg` (1963 bytes)
- `ge.svg` (2257 bytes)
- `gf.svg` (280 bytes)
- `gg.svg` (664 bytes)
- `gh.svg` (320 bytes)
- `gi.svg` (4115 bytes)
- `gl.svg` (351 bytes)
- `gm.svg` (421 bytes)
- `gn.svg` (314 bytes)
- `gp.svg` (305 bytes)
- `gq.svg` (7801 bytes)
- `gr.svg` (876 bytes)
- `gs.svg` (47051 bytes)
- `gt.svg` (59566 bytes)
- `gu.svg` (6066 bytes)
- `gw.svg` (896 bytes)
- `gy.svg` (573 bytes)
- `hk.svg` (4564 bytes)
- `hm.svg` (1758 bytes)
- `hn.svg` (1144 bytes)
- `hr.svg` (80026 bytes)
- `ht.svg` (22430 bytes)
- `hu.svg` (315 bytes)
- `id.svg` (252 bytes)
- `ie.svg` (317 bytes)
- `il.svg` (981 bytes)
- `im.svg` (15584 bytes)
- `in.svg` (1102 bytes)
- `io.svg` (36427 bytes)
- `iq.svg` (2321 bytes)
- `ir.svg` (20114 bytes)
- `is.svg` (531 bytes)
- `it.svg` (305 bytes)
- `je.svg` (7355 bytes)
- `jm.svg` (488 bytes)
- `jo.svg` (755 bytes)
- `jp.svg` (514 bytes)
- `ke.svg` (1570 bytes)
- `kg.svg` (5011 bytes)
- `kh.svg` (10573 bytes)
- `ki.svg` (7717 bytes)
- `km.svg` (1222 bytes)
- `kn.svg` (944 bytes)
- `kp.svg` (990 bytes)
- `kr.svg` (2178 bytes)
- `kw.svg` (529 bytes)
- `ky.svg` (33460 bytes)
- `kz.svg` (17461 bytes)
- `la.svg` (604 bytes)
- `lb.svg` (3942 bytes)
- `lc.svg` (409 bytes)
- `li.svg` (12476 bytes)
- `lk.svg` (17573 bytes)
- `lr.svg` (790 bytes)
- `ls.svg` (1700 bytes)
- `lt.svg` (450 bytes)
- `lu.svg` (239 bytes)
- `lv.svg` (264 bytes)
- `ly.svg` (535 bytes)
- `ma.svg` (270 bytes)
- `mc.svg` (260 bytes)
- `md.svg` (14789 bytes)
- `me.svg` (107858 bytes)
- `mf.svg` (305 bytes)
- `mg.svg` (337 bytes)
- `mh.svg` (1017 bytes)
- `mk.svg` (423 bytes)
- `ml.svg` (299 bytes)
- `mm.svg` (884 bytes)
- `mn.svg` (1603 bytes)
- `mo.svg` (2082 bytes)
- `mp.svg` (33834 bytes)
- `mq.svg` (305 bytes)
- `mr.svg` (621 bytes)
- `ms.svg` (8545 bytes)
- `mt.svg` (15229 bytes)
- `mu.svg` (340 bytes)
- `mv.svg` (318 bytes)
- `mw.svg` (5848 bytes)
- `mx.svg` (157469 bytes)
- `my.svg` (1538 bytes)
- `mz.svg` (3570 bytes)
- `na.svg` (1262 bytes)
- `nc.svg` (305 bytes)
- `ne.svg` (291 bytes)
- `nf.svg` (8886 bytes)
- `ng.svg` (284 bytes)
- `ni.svg` (28902 bytes)
- `nl.svg` (379 bytes)
- `no.svg` (324 bytes)
- `np.svg` (1508 bytes)
- `nr.svg` (802 bytes)
- `nu.svg` (2294 bytes)
- `nz.svg` (3177 bytes)
- `om.svg` (29021 bytes)
- `pa.svg` (785 bytes)
- `pe.svg` (114770 bytes)
- `pf.svg` (6032 bytes)
- `pg.svg` (2958 bytes)
- `ph.svg` (1365 bytes)
- `pk.svg` (852 bytes)
- `pl.svg` (228 bytes)
- `pm.svg` (305 bytes)
- `pn.svg` (14487 bytes)
- `pr.svg` (685 bytes)
- `ps.svg` (548 bytes)
- `pt.svg` (12307 bytes)
- `pw.svg` (596 bytes)
- `py.svg` (27026 bytes)
- `qa.svg` (430 bytes)
- `re.svg` (305 bytes)
- `ro.svg` (324 bytes)
- `rs.svg` (187945 bytes)
- `ru.svg` (309 bytes)
- `rw.svg` (795 bytes)
- `sa.svg` (16301 bytes)
- `sb.svg` (1210 bytes)
- `sc.svg` (623 bytes)
- `sd.svg` (515 bytes)
- `se.svg` (792 bytes)
- `sg.svg` (1344 bytes)
- `sh.svg` (49137 bytes)
- `si.svg` (2922 bytes)
- `sj.svg` (324 bytes)
- `sk.svg` (1632 bytes)
- `sl.svg` (445 bytes)
- `sm.svg` (22541 bytes)
- `sn.svg` (480 bytes)
- `so.svg` (559 bytes)
- `sr.svg` (341 bytes)
- `ss.svg` (409 bytes)
- `st.svg` (933 bytes)
- `sv.svg` (129682 bytes)
- `sx.svg` (19650 bytes)
- `sy.svg` (682 bytes)
- `sz.svg` (8973 bytes)
- `tc.svg` (19648 bytes)
- `td.svg` (294 bytes)
- `tf.svg` (1291 bytes)
- `tg.svg` (839 bytes)
- `th.svg` (299 bytes)
- `tj.svg` (1908 bytes)
- `tk.svg` (781 bytes)
- `tl.svg` (675 bytes)
- `tm.svg` (44313 bytes)
- `tn.svg` (944 bytes)
- `to.svg` (387 bytes)
- `tr.svg` (690 bytes)
- `tt.svg` (393 bytes)
- `tv.svg` (2925 bytes)
- `tw.svg` (1228 bytes)
- `tz.svg` (680 bytes)
- `ua.svg` (249 bytes)
- `ug.svg` (5274 bytes)
- `um.svg` (5631 bytes)
- `un.svg` (32130 bytes)
- `us.svg` (5462 bytes)
- `uy.svg` (1746 bytes)
- `uz.svg` (1487 bytes)
- `va.svg` (113384 bytes)
- `vc.svg` (577 bytes)
- `ve.svg` (1207 bytes)
- `vg.svg` (33922 bytes)
- `vi.svg` (12022 bytes)
- `vn.svg` (559 bytes)
- `vu.svg` (5783 bytes)
- `wf.svg` (298 bytes)
- `ws.svg` (857 bytes)
- `ye.svg` (298 bytes)
- `yt.svg` (305 bytes)
- `za.svg` (1014 bytes)
- `zm.svg` (8197 bytes)
- `zw.svg` (10882 bytes)

### `C:\xampp\htdocs\Project\JailMeet\prisoner\assets\flags\4x3`
- `ad.svg` (56452 bytes)
- `ae.svg` (257 bytes)
- `af.svg` (33813 bytes)
- `ag.svg` (902 bytes)
- `ai.svg` (55336 bytes)
- `al.svg` (4647 bytes)
- `am.svg` (226 bytes)
- `ao.svg` (2245 bytes)
- `aq.svg` (4488 bytes)
- `ar.svg` (4395 bytes)
- `as.svg` (11465 bytes)
- `at.svg` (251 bytes)
- `au.svg` (1761 bytes)
- `aw.svg` (14674 bytes)
- `ax.svg` (563 bytes)
- `az.svg` (555 bytes)
- `ba.svg` (1780 bytes)
- `bb.svg` (767 bytes)
- `bd.svg` (193 bytes)
- `be.svg` (318 bytes)
- `bf.svg` (435 bytes)
- `bg.svg` (305 bytes)
- `bh.svg` (610 bytes)
- `bi.svg` (1317 bytes)
- `bj.svg` (503 bytes)
- `bl.svg` (315 bytes)
- `bm.svg` (32108 bytes)
- `bn.svg` (21816 bytes)
- `bo.svg` (189526 bytes)
- `bq.svg` (227 bytes)
- `br.svg` (12458 bytes)
- `bs.svg` (596 bytes)
- `bt.svg` (38195 bytes)
- `bv.svg` (635 bytes)
- `bw.svg` (261 bytes)
- `by.svg` (9066 bytes)
- `bz.svg` (76131 bytes)
- `ca.svg` (960 bytes)
- `cc.svg` (4325 bytes)
- `cd.svg` (352 bytes)
- `cf.svg` (757 bytes)
- `cg.svg` (492 bytes)
- `ch.svg` (324 bytes)
- `ci.svg` (292 bytes)
- `ck.svg` (2639 bytes)
- `cl.svg` (623 bytes)
- `cm.svg` (847 bytes)
- `cn.svg` (848 bytes)
- `co.svg` (292 bytes)
- `cr.svg` (303 bytes)
- `cu.svg` (670 bytes)
- `cv.svg` (1707 bytes)
- `cw.svg` (705 bytes)
- `cx.svg` (3488 bytes)
- `cy.svg` (10069 bytes)
- `cz.svg` (489 bytes)
- `de.svg` (220 bytes)
- `dj.svg` (629 bytes)
- `dk.svg` (249 bytes)
- `dm.svg` (20439 bytes)
- `do.svg` (466688 bytes)
- `dz.svg` (301 bytes)
- `ec.svg` (38432 bytes)
- `ee.svg` (324 bytes)
- `eg.svg` (16086 bytes)
- `eh.svg` (1081 bytes)
- `er.svg` (4800 bytes)
- `es.svg` (145196 bytes)
- `es-ct.svg` (261 bytes)
- `et.svg` (1562 bytes)
- `eu.svg` (1277 bytes)
- `fi.svg` (253 bytes)
- `fj.svg` (44090 bytes)
- `fk.svg` (44410 bytes)
- `fm.svg` (936 bytes)
- `fo.svg` (638 bytes)
- `fr.svg` (301 bytes)
- `ga.svg` (285 bytes)
- `gb.svg` (956 bytes)
- `gb-eng.svg` (245 bytes)
- `gb-nir.svg` (34040 bytes)
- `gb-sct.svg` (234 bytes)
- `gb-wls.svg` (14480 bytes)
- `gd.svg` (1810 bytes)
- `ge.svg` (2322 bytes)
- `gf.svg` (276 bytes)
- `gg.svg` (621 bytes)
- `gh.svg` (300 bytes)
- `gi.svg` (4125 bytes)
- `gl.svg` (314 bytes)
- `gm.svg` (558 bytes)
- `gn.svg` (310 bytes)
- `gp.svg` (301 bytes)
- `gq.svg` (6078 bytes)
- `gr.svg` (819 bytes)
- `gs.svg` (46523 bytes)
- `gt.svg` (59566 bytes)
- `gu.svg` (6350 bytes)
- `gw.svg` (816 bytes)
- `gy.svg` (573 bytes)
- `hk.svg` (4503 bytes)
- `hm.svg` (1800 bytes)
- `hn.svg` (1138 bytes)
- `hr.svg` (79766 bytes)
- `ht.svg` (22423 bytes)
- `hu.svg` (316 bytes)
- `id.svg` (252 bytes)
- `ie.svg` (321 bytes)
- `il.svg` (1034 bytes)
- `im.svg` (15245 bytes)
- `in.svg` (1080 bytes)
- `io.svg` (36354 bytes)
- `iq.svg` (2305 bytes)
- `ir.svg` (20291 bytes)
- `is.svg` (550 bytes)
- `it.svg` (317 bytes)
- `je.svg` (7387 bytes)
- `jm.svg` (417 bytes)
- `jo.svg` (823 bytes)
- `jp.svg` (501 bytes)
- `ke.svg` (1432 bytes)
- `kg.svg` (5088 bytes)
- `kh.svg` (10571 bytes)
- `ki.svg` (7523 bytes)
- `km.svg` (1286 bytes)
- `kn.svg` (956 bytes)
- `kp.svg` (990 bytes)
- `kr.svg` (2404 bytes)
- `kw.svg` (515 bytes)
- `ky.svg` (33127 bytes)
- `kz.svg` (17487 bytes)
- `la.svg` (477 bytes)
- `lb.svg` (3944 bytes)
- `lc.svg` (403 bytes)
- `li.svg` (12453 bytes)
- `lk.svg` (17549 bytes)
- `lr.svg` (818 bytes)
- `ls.svg` (1708 bytes)
- `lt.svg` (450 bytes)
- `lu.svg` (231 bytes)
- `lv.svg` (252 bytes)
- `ly.svg` (537 bytes)
- `ma.svg` (272 bytes)
- `mc.svg` (240 bytes)
- `md.svg` (14620 bytes)
- `me.svg` (107894 bytes)
- `mf.svg` (301 bytes)
- `mg.svg` (310 bytes)
- `mh.svg` (1008 bytes)
- `mk.svg` (395 bytes)
- `ml.svg` (288 bytes)
- `mm.svg` (857 bytes)
- `mn.svg` (1601 bytes)
- `mo.svg` (2047 bytes)
- `mp.svg` (33850 bytes)
- `mq.svg` (298 bytes)
- `mr.svg` (582 bytes)
- `ms.svg` (8573 bytes)
- `mt.svg` (13349 bytes)
- `mu.svg` (322 bytes)
- `mv.svg` (292 bytes)
- `mw.svg` (5551 bytes)
- `mx.svg` (160524 bytes)
- `my.svg` (1547 bytes)
- `mz.svg` (3543 bytes)
- `na.svg` (1276 bytes)
- `nc.svg` (317 bytes)
- `ne.svg` (279 bytes)
- `nf.svg` (9006 bytes)
- `ng.svg` (287 bytes)
- `ni.svg` (28892 bytes)
- `nl.svg` (373 bytes)
- `no.svg` (324 bytes)
- `np.svg` (1366 bytes)
- `nr.svg` (811 bytes)
- `nu.svg` (2301 bytes)
- `nz.svg` (3152 bytes)
- `om.svg` (29157 bytes)
- `pa.svg` (879 bytes)
- `pe.svg` (115566 bytes)
- `pf.svg` (6043 bytes)
- `pg.svg` (2212 bytes)
- `ph.svg` (1365 bytes)
- `pk.svg` (910 bytes)
- `pl.svg` (228 bytes)
- `pm.svg` (317 bytes)
- `pn.svg` (15414 bytes)
- `pr.svg` (703 bytes)
- `ps.svg` (597 bytes)
- `pt.svg` (12214 bytes)
- `pw.svg` (489 bytes)
- `py.svg` (26946 bytes)
- `qa.svg` (414 bytes)
- `re.svg` (317 bytes)
- `ro.svg` (320 bytes)
- `rs.svg` (188066 bytes)
- `ru.svg` (297 bytes)
- `rw.svg` (793 bytes)
- `sa.svg` (16052 bytes)
- `sb.svg` (1187 bytes)
- `sc.svg` (579 bytes)
- `sd.svg` (501 bytes)
- `se.svg` (756 bytes)
- `sg.svg` (1260 bytes)
- `sh.svg` (48210 bytes)
- `si.svg` (2906 bytes)
- `sj.svg` (324 bytes)
- `sk.svg` (1621 bytes)
- `sl.svg` (286 bytes)
- `sm.svg` (22175 bytes)
- `sn.svg` (485 bytes)
- `so.svg` (546 bytes)
- `sr.svg` (331 bytes)
- `ss.svg` (399 bytes)
- `st.svg` (928 bytes)
- `sv.svg` (129527 bytes)
- `sx.svg` (19833 bytes)
- `sy.svg` (651 bytes)
- `sz.svg` (9061 bytes)
- `tc.svg` (19375 bytes)
- `td.svg` (288 bytes)
- `tf.svg` (1118 bytes)
- `tg.svg` (831 bytes)
- `th.svg` (300 bytes)
- `tj.svg` (2043 bytes)
- `tk.svg` (791 bytes)
- `tl.svg` (658 bytes)
- `tm.svg` (44437 bytes)
- `tn.svg` (972 bytes)
- `to.svg` (385 bytes)
- `tr.svg` (688 bytes)
- `tt.svg` (365 bytes)
- `tv.svg` (2929 bytes)
- `tw.svg` (1252 bytes)
- `tz.svg` (570 bytes)
- `ua.svg` (241 bytes)
- `ug.svg` (5311 bytes)
- `um.svg` (6330 bytes)
- `un.svg` (31000 bytes)
- `us.svg` (6188 bytes)
- `uy.svg` (1741 bytes)
- `uz.svg` (1465 bytes)
- `va.svg` (114045 bytes)
- `vc.svg` (512 bytes)
- `ve.svg` (1179 bytes)
- `vg.svg` (33930 bytes)
- `vi.svg` (12146 bytes)
- `vn.svg` (548 bytes)
- `vu.svg` (5820 bytes)
- `wf.svg` (310 bytes)
- `ws.svg` (880 bytes)
- `ye.svg` (287 bytes)
- `yt.svg` (317 bytes)
- `za.svg` (1068 bytes)
- `zm.svg` (8162 bytes)
- `zw.svg` (10902 bytes)

### `C:\xampp\htdocs\Project\JailMeet\prisoner\assets\fonts`
- `fontawesome-webfont.svg` (444379 bytes)
- `line-awesome.svg` (433695 bytes)
- `Material-Design-Iconic-Font.svg` (239859 bytes)
- `Simple-Line-Icons.svg` (239045 bytes)
- `themify.svg` (234269 bytes)
- `weathericons-regular-webfont.svg` (184969 bytes)

### `C:\xampp\htdocs\Project\JailMeet\prisoner\assets\images`
- `favicon.ico` (1150 bytes)
- `logo-icon.png` (6746 bytes)

### `C:\xampp\htdocs\Project\JailMeet\prisoner\assets\images\bg-themes`
- `1.png` (489774 bytes)
- `2.png` (143296 bytes)
- `3.png` (812131 bytes)
- `4.png` (537987 bytes)
- `5.png` (465167 bytes)
- `6.png` (561716 bytes)

### `C:\xampp\htdocs\Project\JailMeet\prisoner\assets\images\gallery`
- `cd-icon-navigation.svg` (3285 bytes)

### `C:\xampp\htdocs\Project\JailMeet\prisoner\assets\images\timeline`
- `angular-icon.svg` (749 bytes)
- `bootstrap-4.svg` (1283 bytes)
- `cd-arrow.svg` (373 bytes)
- `cd-icon-location.svg` (394 bytes)
- `cd-icon-movie.svg` (442 bytes)
- `cd-icon-picture.svg` (507 bytes)
- `css-3.svg` (1027 bytes)
- `html5.svg` (812 bytes)
- `react.svg` (4555 bytes)

### `C:\xampp\htdocs\Project\JailMeet\prisoner\assets1\img`
- `about.jpg` (104176 bytes)
- `about-2.jpg` (100134 bytes)
- `apple-touch-icon.png` (7489 bytes)
- `favicon.png` (1156 bytes)
- `hero-bg.jpg` (252016 bytes)
- `logo.png` (3432 bytes)
- `page-title-bg.webp` (88924 bytes)
- `services.jpg` (54414 bytes)
- `services-1.jpg` (79550 bytes)
- `services-2.jpg` (50649 bytes)
- `services-3.jpg` (55307 bytes)
- `testimonials-bg.jpg` (363004 bytes)
- `working-1.jpg` (122091 bytes)
- `working-2.jpg` (54824 bytes)
- `working-3.jpg` (91314 bytes)
- `working-4.jpg` (98318 bytes)

### `C:\xampp\htdocs\Project\JailMeet\prisoner\assets1\img\clients`
- `client-1.png` (5282 bytes)
- `client-2.png` (4582 bytes)
- `client-3.png` (4707 bytes)
- `client-4.png` (4587 bytes)
- `client-5.png` (5123 bytes)
- `client-6.png` (3450 bytes)

### `C:\xampp\htdocs\Project\JailMeet\prisoner\assets1\img\portfolio`
- `app-1.jpg` (67064 bytes)
- `app-2.jpg` (73871 bytes)
- `app-3.jpg` (42308 bytes)
- `books-1.jpg` (80146 bytes)
- `books-2.jpg` (60824 bytes)
- `books-3.jpg` (91462 bytes)
- `branding-1.jpg` (25514 bytes)
- `branding-2.jpg` (52305 bytes)
- `branding-3.jpg` (77892 bytes)
- `product-1.jpg` (62035 bytes)
- `product-2.jpg` (89298 bytes)
- `product-3.jpg` (20090 bytes)

### `C:\xampp\htdocs\Project\JailMeet\prisoner\assets1\img\team`
- `team-1.jpg` (64386 bytes)
- `team-2.jpg` (34427 bytes)
- `team-3.jpg` (25992 bytes)

### `C:\xampp\htdocs\Project\JailMeet\prisoner\assets1\img\testimonials`
- `testimonials-1.jpg` (39727 bytes)
- `testimonials-2.jpg` (57584 bytes)
- `testimonials-3.jpg` (17247 bytes)
- `testimonials-4.jpg` (20220 bytes)
- `testimonials-5.jpg` (22595 bytes)

### `C:\xampp\htdocs\Project\JailMeet\prisoner\documentation\assets\blueprint-css\plugins\buttons\icons`
- `cross.png` (655 bytes)
- `key.png` (455 bytes)
- `tick.png` (537 bytes)

### `C:\xampp\htdocs\Project\JailMeet\prisoner\documentation\assets\blueprint-css\plugins\link-icons\icons`
- `doc.png` (777 bytes)
- `email.png` (641 bytes)
- `external.png` (46848 bytes)
- `feed.png` (691 bytes)
- `im.png` (741 bytes)
- `pdf.png` (591 bytes)
- `visited.png` (46990 bytes)
- `xls.png` (663 bytes)

### `C:\xampp\htdocs\Project\JailMeet\prisoner\documentation\assets\blueprint-css\src`
- `grid.png` (161 bytes)

### `C:\xampp\htdocs\Project\JailMeet\prisoner\documentation\assets\images`
- `htmlstructure.png` (48307 bytes)

### `C:\xampp\htdocs\Project\JailMeet\uploads`
- `67fc0bd742bbf_1744571351.jpg` (2109118 bytes)
- `67fc0bfe83573_1744571390.jpg` (673172 bytes)
- `67fc112fd0293_1744572719.jpg` (225566 bytes)

### `C:\xampp\htdocs\Project\JailMeet\visitor\assets\img`
- `about.jpg` (104176 bytes)
- `about-2.jpg` (100134 bytes)
- `apple-touch-icon.png` (7489 bytes)
- `favicon.png` (1156 bytes)
- `hero-bg.jpg` (252016 bytes)
- `logo.png` (3432 bytes)
- `page-title-bg.webp` (88924 bytes)
- `services.jpg` (54414 bytes)
- `services-1.jpg` (79550 bytes)
- `services-2.jpg` (50649 bytes)
- `services-3.jpg` (55307 bytes)
- `testimonials-bg.jpg` (363004 bytes)
- `working-1.jpg` (122091 bytes)
- `working-2.jpg` (54824 bytes)
- `working-3.jpg` (91314 bytes)
- `working-4.jpg` (98318 bytes)

### `C:\xampp\htdocs\Project\JailMeet\visitor\assets\img\clients`
- `client-1.png` (5282 bytes)
- `client-2.png` (4582 bytes)
- `client-3.png` (4707 bytes)
- `client-4.png` (4587 bytes)
- `client-5.png` (5123 bytes)
- `client-6.png` (3450 bytes)

### `C:\xampp\htdocs\Project\JailMeet\visitor\assets\img\portfolio`
- `app-1.jpg` (67064 bytes)
- `app-2.jpg` (73871 bytes)
- `app-3.jpg` (42308 bytes)
- `books-1.jpg` (80146 bytes)
- `books-2.jpg` (60824 bytes)
- `books-3.jpg` (91462 bytes)
- `branding-1.jpg` (25514 bytes)
- `branding-2.jpg` (52305 bytes)
- `branding-3.jpg` (77892 bytes)
- `product-1.jpg` (62035 bytes)
- `product-2.jpg` (89298 bytes)
- `product-3.jpg` (20090 bytes)

### `C:\xampp\htdocs\Project\JailMeet\visitor\assets\img\team`
- `team-1.jpg` (64386 bytes)
- `team-2.jpg` (34427 bytes)
- `team-3.jpg` (25992 bytes)

### `C:\xampp\htdocs\Project\JailMeet\visitor\assets\img\testimonials`
- `testimonials-1.jpg` (39727 bytes)
- `testimonials-2.jpg` (57584 bytes)
- `testimonials-3.jpg` (17247 bytes)
- `testimonials-4.jpg` (20220 bytes)
- `testimonials-5.jpg` (22595 bytes)

### `C:\xampp\htdocs\Project\JailMeet\visitor\visitorpage\assets\img\avatars`
- `1.png` (14015 bytes)
- `5.png` (20488 bytes)
- `6.png` (15198 bytes)
- `7.png` (15180 bytes)

### `C:\xampp\htdocs\Project\JailMeet\visitor\visitorpage\assets\img\backgrounds`
- `18.jpg` (88783 bytes)

### `C:\xampp\htdocs\Project\JailMeet\visitor\visitorpage\assets\img\elements`
- `1.jpg` (18135 bytes)
- `11.jpg` (19087 bytes)
- `12.jpg` (28075 bytes)
- `13.jpg` (12929 bytes)
- `17.jpg` (19716 bytes)
- `18.jpg` (31223 bytes)
- `19.jpg` (15553 bytes)
- `2.jpg` (13332 bytes)
- `20.jpg` (16593 bytes)
- `3.jpg` (24285 bytes)
- `4.jpg` (22875 bytes)
- `5.jpg` (22938 bytes)
- `7.jpg` (21183 bytes)

### `C:\xampp\htdocs\Project\JailMeet\visitor\visitorpage\assets\img\favicon`
- `favicon.ico` (1393 bytes)

### `C:\xampp\htdocs\Project\JailMeet\visitor\visitorpage\assets\img\icons\brands`
- `asana.png` (2236 bytes)
- `behance.png` (1731 bytes)
- `dribbble.png` (2848 bytes)
- `facebook.png` (681 bytes)
- `github.png` (2169 bytes)
- `google.png` (1932 bytes)
- `instagram.png` (3128 bytes)
- `mailchimp.png` (1405 bytes)
- `slack.png` (2550 bytes)
- `twitter.png` (1564 bytes)

### `C:\xampp\htdocs\Project\JailMeet\visitor\visitorpage\assets\img\icons\unicons`
- `cc-primary.png` (702 bytes)
- `cc-success.png` (776 bytes)
- `cc-warning.png` (689 bytes)
- `chart.png` (1491 bytes)
- `chart-success.png` (1528 bytes)
- `paypal.png` (1090 bytes)
- `wallet.png` (920 bytes)
- `wallet-info.png` (936 bytes)

### `C:\xampp\htdocs\Project\JailMeet\visitor\visitorpage\assets\img\illustrations`
- `girl-doing-yoga-light.png` (219096 bytes)
- `man-with-laptop-light.png` (8826 bytes)
- `page-misc-error-light.png` (139086 bytes)

### `C:\xampp\htdocs\Project\JailMeet\visitor\visitorpage\assets\img\layouts`
- `layout-container-light.png` (62469 bytes)
- `layout-fluid-light.png` (58375 bytes)
- `layout-without-menu-light.png` (45251 bytes)
- `layout-without-navbar-light.png` (63976 bytes)

### `C:\xampp\htdocs\Project\JailMeet\visitor\visitorpage\assets\vendor\fonts\boxicons`
- `boxicons.svg` (1125137 bytes)

### `C:\xampp\htdocs\Project\JailMeet\visitor\visitorpage\html`
- `images.png` (7926 bytes)
- `jmblack.png` (16506 bytes)
- `userlogo.webp` (41134 bytes)

### `C:\xampp\htdocs\Project\JailMeet\visitor\visitorpage\html\slideshow`
- `1.jpg` (1884083 bytes)
- `2.jpg` (2712491 bytes)
- `3.jpg` (2774960 bytes)

## All Video Files Found (Grouped By Folder)

### `C:\xampp\htdocs\Project\JailMeet`
- `jailmeet_video.mp4` (7110900 bytes)


## All Document Files Found (Grouped By Folder)

- None found for `.pdf`, `.doc`, or `.docx`.

## Static Template Assets

These are safe to ignore or replace in JailMeet 2.0 unless you specifically want to preserve the old visual theme.

- Root landing page brand/demo/team assets: `afzal.jpg`, `ajmal.jpg`, `alan.jpg`, `anaf.jpg`, `images.png`, `jmlogo.png`, `logo.png`, `prison1.jpg`, `prisoner*.jpeg/jpg`, `video_thumbnail.jpg`, `jailmeet_video.mp4`.
- Bootstrap/Append/landing theme images under `assets/img`, `admin/assets/img`, `officer/assets/img`, `visitor/assets/img`, and `prisoner/assets1/img`.
- Kaiadmin/admin dashboard template assets under `admin/assets1`.
- DeskApp/officer dashboard assets under `officer/vendors`, `officer/src`, and related plugin folders.
- Prisoner dashboard template flags, icons, documentation images under `prisoner/assets` and `prisoner/documentation`.
- Visitor dashboard template assets under `visitor/visitorpage/assets` and static slideshow/logo images under `visitor/visitorpage/html`.

## Uploaded User/Prisoner/Visitor Assets

| Folder | Evidence | Classification | Must migrate? |
| --- | --- | --- | --- |
| `C:\xampp\htdocs\Project\JailMeet\officer\uploads` | `officer/prisoners.php` and `admin/prisonerdetails.php` upload `$_FILES["dp"]` here and store only the filename in `prisoner.dp`; prisoner/visitor pages read from this folder. | USER-UPLOADED prisoner photos | yes |
| `C:\xampp\htdocs\Project\JailMeet\uploads` | Contains 3 generated-looking JPG files, but no current PHP/HTML/CSS reference was found. Could be orphaned from an earlier upload feature or a general upload folder. | USER-UPLOADED candidate / uncertain | yes, to `documents` for manual review |
| `C:\xampp\htdocs\Project\JailMeet\visitor\profilepics` | Folder exists but is empty. `visitors.profile_pic` exists, but registration inserts an empty string and no upload handler was found. | USER-UPLOADED candidate, empty | no |

## PHP/HTML/CSS Files Referencing Each Media Folder

| Media folder | Referencing files found |
| --- | --- |
| `C:\xampp\htdocs\Project\JailMeet` | index.php; visitor/login.php; visitor/register.php; prisoner/prisonerlogin.php; prisoner/sidebar.php |
| `C:\xampp\htdocs\Project\JailMeet\admin` | Mostly static template references or no direct references found |
| `C:\xampp\htdocs\Project\JailMeet\admin\assets\img` | index/static pages/includes in root/admin/officer/prisoner/visitor; CSS background references |
| `C:\xampp\htdocs\Project\JailMeet\admin\assets\img\clients` | index/static pages/includes in root/admin/officer/prisoner/visitor; CSS background references |
| `C:\xampp\htdocs\Project\JailMeet\admin\assets\img\portfolio` | index/static pages/includes in root/admin/officer/prisoner/visitor; CSS background references |
| `C:\xampp\htdocs\Project\JailMeet\admin\assets\img\team` | index/static pages/includes in root/admin/officer/prisoner/visitor; CSS background references |
| `C:\xampp\htdocs\Project\JailMeet\admin\assets\img\testimonials` | index/static pages/includes in root/admin/officer/prisoner/visitor; CSS background references |
| `C:\xampp\htdocs\Project\JailMeet\admin\assets1\fonts\fontawesome` | admin/*.php; admin/includes/navbar.php; Kaiadmin/static dashboard pages |
| `C:\xampp\htdocs\Project\JailMeet\admin\assets1\fonts\simple-line-icons` | admin/*.php; admin/includes/navbar.php; Kaiadmin/static dashboard pages |
| `C:\xampp\htdocs\Project\JailMeet\admin\assets1\img` | admin/*.php; admin/includes/navbar.php; Kaiadmin/static dashboard pages |
| `C:\xampp\htdocs\Project\JailMeet\admin\assets1\img\examples` | admin/*.php; admin/includes/navbar.php; Kaiadmin/static dashboard pages |
| `C:\xampp\htdocs\Project\JailMeet\admin\assets1\img\flags` | admin/*.php; admin/includes/navbar.php; Kaiadmin/static dashboard pages |
| `C:\xampp\htdocs\Project\JailMeet\admin\assets1\img\kaiadmin` | admin/*.php; admin/includes/navbar.php; Kaiadmin/static dashboard pages |
| `C:\xampp\htdocs\Project\JailMeet\admin\assets1\img\undraw` | admin/*.php; admin/includes/navbar.php; Kaiadmin/static dashboard pages |
| `C:\xampp\htdocs\Project\JailMeet\admin\assets1\js\plugin\owl-carousel` | admin/*.php; admin/includes/navbar.php; Kaiadmin/static dashboard pages |
| `C:\xampp\htdocs\Project\JailMeet\assets\img` | index/static pages/includes in root/admin/officer/prisoner/visitor; CSS background references |
| `C:\xampp\htdocs\Project\JailMeet\assets\img\clients` | index/static pages/includes in root/admin/officer/prisoner/visitor; CSS background references |
| `C:\xampp\htdocs\Project\JailMeet\assets\img\portfolio` | index/static pages/includes in root/admin/officer/prisoner/visitor; CSS background references |
| `C:\xampp\htdocs\Project\JailMeet\assets\img\team` | index/static pages/includes in root/admin/officer/prisoner/visitor; CSS background references |
| `C:\xampp\htdocs\Project\JailMeet\assets\img\testimonials` | index/static pages/includes in root/admin/officer/prisoner/visitor; CSS background references |
| `C:\xampp\htdocs\Project\JailMeet\officer` | Mostly static template references or no direct references found |
| `C:\xampp\htdocs\Project\JailMeet\officer\assets\img` | index/static pages/includes in root/admin/officer/prisoner/visitor; CSS background references |
| `C:\xampp\htdocs\Project\JailMeet\officer\assets\img\clients` | index/static pages/includes in root/admin/officer/prisoner/visitor; CSS background references |
| `C:\xampp\htdocs\Project\JailMeet\officer\assets\img\portfolio` | index/static pages/includes in root/admin/officer/prisoner/visitor; CSS background references |
| `C:\xampp\htdocs\Project\JailMeet\officer\assets\img\team` | index/static pages/includes in root/admin/officer/prisoner/visitor; CSS background references |
| `C:\xampp\htdocs\Project\JailMeet\officer\assets\img\testimonials` | index/static pages/includes in root/admin/officer/prisoner/visitor; CSS background references |
| `C:\xampp\htdocs\Project\JailMeet\officer\src\fonts\dropways` | officer template source/demo files |
| `C:\xampp\htdocs\Project\JailMeet\officer\src\fonts\font-awesome\fonts` | officer template source/demo files |
| `C:\xampp\htdocs\Project\JailMeet\officer\src\fonts\foundation-icons` | officer template source/demo files |
| `C:\xampp\htdocs\Project\JailMeet\officer\src\fonts\ionicons-master\fonts` | officer template source/demo files |
| `C:\xampp\htdocs\Project\JailMeet\officer\src\fonts\themify-icons\fonts` | officer template source/demo files |
| `C:\xampp\htdocs\Project\JailMeet\officer\src\images` | officer template source/demo files |
| `C:\xampp\htdocs\Project\JailMeet\officer\src\images\layout` | officer template source/demo files |
| `C:\xampp\htdocs\Project\JailMeet\officer\src\plugins\datatables\images` | officer template source/demo files |
| `C:\xampp\htdocs\Project\JailMeet\officer\src\plugins\jquery-asColorPicker\dist\images` | officer template source/demo files |
| `C:\xampp\htdocs\Project\JailMeet\officer\src\plugins\plyr\dist` | officer template source/demo files |
| `C:\xampp\htdocs\Project\JailMeet\officer\uploads` | officer/prisoners.php; admin/prisonerdetails.php; prisoner/index.php; prisoner/navbar.php; visitor/visitorpage/html/prisoners.php |
| `C:\xampp\htdocs\Project\JailMeet\officer\vendors\fonts` | Mostly static template references or no direct references found |
| `C:\xampp\htdocs\Project\JailMeet\officer\vendors\images` | officer/*.php and officer/*.html DeskApp template pages |
| `C:\xampp\htdocs\Project\JailMeet\officer\vendors\images\layout` | officer/*.php and officer/*.html DeskApp template pages |
| `C:\xampp\htdocs\Project\JailMeet\prisoner\assets\flags\1x1` | prisoner/*.php, prisoner/*.html, prisoner/documentation/*.html |
| `C:\xampp\htdocs\Project\JailMeet\prisoner\assets\flags\4x3` | prisoner/*.php, prisoner/*.html, prisoner/documentation/*.html |
| `C:\xampp\htdocs\Project\JailMeet\prisoner\assets\fonts` | prisoner/*.php, prisoner/*.html, prisoner/documentation/*.html |
| `C:\xampp\htdocs\Project\JailMeet\prisoner\assets\images` | prisoner/*.php, prisoner/*.html, prisoner/documentation/*.html |
| `C:\xampp\htdocs\Project\JailMeet\prisoner\assets\images\bg-themes` | prisoner/*.php, prisoner/*.html, prisoner/documentation/*.html |
| `C:\xampp\htdocs\Project\JailMeet\prisoner\assets\images\gallery` | prisoner/*.php, prisoner/*.html, prisoner/documentation/*.html |
| `C:\xampp\htdocs\Project\JailMeet\prisoner\assets\images\timeline` | prisoner/*.php, prisoner/*.html, prisoner/documentation/*.html |
| `C:\xampp\htdocs\Project\JailMeet\prisoner\assets1\img` | prisoner/*.php, prisoner/*.html, prisoner/documentation/*.html |
| `C:\xampp\htdocs\Project\JailMeet\prisoner\assets1\img\clients` | prisoner/*.php, prisoner/*.html, prisoner/documentation/*.html |
| `C:\xampp\htdocs\Project\JailMeet\prisoner\assets1\img\portfolio` | prisoner/*.php, prisoner/*.html, prisoner/documentation/*.html |
| `C:\xampp\htdocs\Project\JailMeet\prisoner\assets1\img\team` | prisoner/*.php, prisoner/*.html, prisoner/documentation/*.html |
| `C:\xampp\htdocs\Project\JailMeet\prisoner\assets1\img\testimonials` | prisoner/*.php, prisoner/*.html, prisoner/documentation/*.html |
| `C:\xampp\htdocs\Project\JailMeet\prisoner\documentation\assets\blueprint-css\plugins\buttons\icons` | Mostly static template references or no direct references found |
| `C:\xampp\htdocs\Project\JailMeet\prisoner\documentation\assets\blueprint-css\plugins\link-icons\icons` | Mostly static template references or no direct references found |
| `C:\xampp\htdocs\Project\JailMeet\prisoner\documentation\assets\blueprint-css\src` | Mostly static template references or no direct references found |
| `C:\xampp\htdocs\Project\JailMeet\prisoner\documentation\assets\images` | Mostly static template references or no direct references found |
| `C:\xampp\htdocs\Project\JailMeet\uploads` | No PHP/HTML/CSS references found |
| `C:\xampp\htdocs\Project\JailMeet\visitor\assets\img` | index/static pages/includes in root/admin/officer/prisoner/visitor; CSS background references |
| `C:\xampp\htdocs\Project\JailMeet\visitor\assets\img\clients` | index/static pages/includes in root/admin/officer/prisoner/visitor; CSS background references |
| `C:\xampp\htdocs\Project\JailMeet\visitor\assets\img\portfolio` | index/static pages/includes in root/admin/officer/prisoner/visitor; CSS background references |
| `C:\xampp\htdocs\Project\JailMeet\visitor\assets\img\team` | index/static pages/includes in root/admin/officer/prisoner/visitor; CSS background references |
| `C:\xampp\htdocs\Project\JailMeet\visitor\assets\img\testimonials` | index/static pages/includes in root/admin/officer/prisoner/visitor; CSS background references |
| `C:\xampp\htdocs\Project\JailMeet\visitor\visitorpage\assets\img\avatars` | index/static pages/includes in root/admin/officer/prisoner/visitor; CSS background references |
| `C:\xampp\htdocs\Project\JailMeet\visitor\visitorpage\assets\img\backgrounds` | index/static pages/includes in root/admin/officer/prisoner/visitor; CSS background references |
| `C:\xampp\htdocs\Project\JailMeet\visitor\visitorpage\assets\img\elements` | index/static pages/includes in root/admin/officer/prisoner/visitor; CSS background references |
| `C:\xampp\htdocs\Project\JailMeet\visitor\visitorpage\assets\img\favicon` | index/static pages/includes in root/admin/officer/prisoner/visitor; CSS background references |
| `C:\xampp\htdocs\Project\JailMeet\visitor\visitorpage\assets\img\icons\brands` | index/static pages/includes in root/admin/officer/prisoner/visitor; CSS background references |
| `C:\xampp\htdocs\Project\JailMeet\visitor\visitorpage\assets\img\icons\unicons` | index/static pages/includes in root/admin/officer/prisoner/visitor; CSS background references |
| `C:\xampp\htdocs\Project\JailMeet\visitor\visitorpage\assets\img\illustrations` | index/static pages/includes in root/admin/officer/prisoner/visitor; CSS background references |
| `C:\xampp\htdocs\Project\JailMeet\visitor\visitorpage\assets\img\layouts` | index/static pages/includes in root/admin/officer/prisoner/visitor; CSS background references |
| `C:\xampp\htdocs\Project\JailMeet\visitor\visitorpage\assets\vendor\fonts\boxicons` | visitor/visitorpage/html/*.php and HTML dashboard pages |
| `C:\xampp\htdocs\Project\JailMeet\visitor\visitorpage\html` | Mostly static template references or no direct references found |
| `C:\xampp\htdocs\Project\JailMeet\visitor\visitorpage\html\slideshow` | Mostly static template references or no direct references found |

## Database Media Columns From `jailmeet.sql`

| Table | Column | Meaning | Stores media filename/path? | Note |
| --- | --- | --- | --- | --- |
| `prisoner` | `dp` | Prisoner display/profile photo filename | yes | Stored value example: `6819bb9290e6a_1746516882.jpg`; physical files are in `officer/uploads`. |
| `visitors` | `profile_pic` | Visitor profile photo field | intended yes, currently mostly empty | Registration inserts `'`; no upload/display handler found in current PHP scan. |
| `prisoner` | `fir` | FIR/report text details | no | Text field, not a file path in this codebase. |
| `prisoner` | `fir_number` | Generated FIR number | no | Identifier text, not a document filename. |

## Media-Related Query And Upload Handling Table

| Table name | Column name | Meaning | PHP file that inserts/updates it | PHP file that displays it | Should become Cloudinary URL/publicId in JailMeet 2.0? |
| --- | --- | --- | --- | --- | --- |
| `prisoner` | `dp` | Prisoner profile/display photo filename | `officer/prisoners.php` inserts/updates; `admin/prisonerdetails.php` updates; both use `move_uploaded_file` to `officer/uploads`. | `officer/prisoners.php`; `admin/prisonerdetails.php`; `prisoner/index.php`; `prisoner/navbar.php`; `visitor/visitorpage/html/prisoners.php` | yes |
| `visitors` | `profile_pic` | Visitor profile photo filename/path placeholder | `visitor/register.php` inserts empty string only. No file upload handler found. | No display reference found in current scan. | yes, if visitor photos are added/migrated later; no current files to migrate |
| `prisoner` | `fir` | FIR/report narrative text | `officer/fir.php`; `officer/add_prisoner.php`; `officer/log_prisoner_detail.php` | `prisoner/index.php`; `visitor/visitorpage/html/prisoners.php`; officer/admin pages | no |
| `prisoner` | `fir_number` | Generated FIR identifier | `officer/fir.php` | `prisoner/index.php`; `visitor/visitorpage/html/prisoners.php` | no |

## Safe To Ignore

- All `assets`, `assets1`, `vendors`, `src`, `documentation`, `flags`, `fonts`, `plugins`, and `visitorpage/assets` media folders are static template/vendor assets and can be ignored or replaced in JailMeet 2.0.
- The root landing page media and demo video can be ignored if JailMeet 2.0 has a new brand/site design.
- `visitor/profilepics` is empty and can be ignored unless you later find a separate visitor-profile upload source outside this folder.

## Should Migrate To JailMeet 2.0

| Old path | JailMeet2.0 legacy-media path | Future Cloudinary folder | Reason |
| --- | --- | --- | --- |
| `C:\xampp\htdocs\Project\JailMeet\officer\uploads` | `C:\Users\afsal\OneDrive\Desktop\JailMeet2.0\legacy-media\prisoners` | `jailmeet/prisoners` | Prisoner uploaded photos referenced by `prisoner.dp`. |
| `C:\xampp\htdocs\Project\JailMeet\uploads` | `C:\Users\afsal\OneDrive\Desktop\JailMeet2.0\legacy-media\documents` | `jailmeet/documents` | Unreferenced but generated-looking upload files; preserve for manual review before deleting. |

## Recommended Folder Mapping

| Old path | JailMeet2.0/legacy-media path | Future Cloudinary folder | Migrate? |
| --- | --- | --- | --- |
| `C:\xampp\htdocs\Project\JailMeet` | `C:\Users\afsal\OneDrive\Desktop\JailMeet2.0\legacy-media\videos` | `jailmeet/videos` | no |
| `C:\xampp\htdocs\Project\JailMeet\admin` | `C:\Users\afsal\OneDrive\Desktop\JailMeet2.0\legacy-media\static-reference` | `jailmeet/static-reference` | no |
| `C:\xampp\htdocs\Project\JailMeet\admin\assets\img` | `C:\Users\afsal\OneDrive\Desktop\JailMeet2.0\legacy-media\static-reference` | `jailmeet/static-reference` | no |
| `C:\xampp\htdocs\Project\JailMeet\admin\assets\img\clients` | `C:\Users\afsal\OneDrive\Desktop\JailMeet2.0\legacy-media\static-reference` | `jailmeet/static-reference` | no |
| `C:\xampp\htdocs\Project\JailMeet\admin\assets\img\portfolio` | `C:\Users\afsal\OneDrive\Desktop\JailMeet2.0\legacy-media\static-reference` | `jailmeet/static-reference` | no |
| `C:\xampp\htdocs\Project\JailMeet\admin\assets\img\team` | `C:\Users\afsal\OneDrive\Desktop\JailMeet2.0\legacy-media\static-reference` | `jailmeet/static-reference` | no |
| `C:\xampp\htdocs\Project\JailMeet\admin\assets\img\testimonials` | `C:\Users\afsal\OneDrive\Desktop\JailMeet2.0\legacy-media\static-reference` | `jailmeet/static-reference` | no |
| `C:\xampp\htdocs\Project\JailMeet\admin\assets1\fonts\fontawesome` | `C:\Users\afsal\OneDrive\Desktop\JailMeet2.0\legacy-media\static-reference` | `jailmeet/static-reference` | no |
| `C:\xampp\htdocs\Project\JailMeet\admin\assets1\fonts\simple-line-icons` | `C:\Users\afsal\OneDrive\Desktop\JailMeet2.0\legacy-media\static-reference` | `jailmeet/static-reference` | no |
| `C:\xampp\htdocs\Project\JailMeet\admin\assets1\img` | `C:\Users\afsal\OneDrive\Desktop\JailMeet2.0\legacy-media\static-reference` | `jailmeet/static-reference` | no |
| `C:\xampp\htdocs\Project\JailMeet\admin\assets1\img\examples` | `C:\Users\afsal\OneDrive\Desktop\JailMeet2.0\legacy-media\static-reference` | `jailmeet/static-reference` | no |
| `C:\xampp\htdocs\Project\JailMeet\admin\assets1\img\flags` | `C:\Users\afsal\OneDrive\Desktop\JailMeet2.0\legacy-media\static-reference` | `jailmeet/static-reference` | no |
| `C:\xampp\htdocs\Project\JailMeet\admin\assets1\img\kaiadmin` | `C:\Users\afsal\OneDrive\Desktop\JailMeet2.0\legacy-media\static-reference` | `jailmeet/static-reference` | no |
| `C:\xampp\htdocs\Project\JailMeet\admin\assets1\img\undraw` | `C:\Users\afsal\OneDrive\Desktop\JailMeet2.0\legacy-media\static-reference` | `jailmeet/static-reference` | no |
| `C:\xampp\htdocs\Project\JailMeet\admin\assets1\js\plugin\owl-carousel` | `C:\Users\afsal\OneDrive\Desktop\JailMeet2.0\legacy-media\static-reference` | `jailmeet/static-reference` | no |
| `C:\xampp\htdocs\Project\JailMeet\assets\img` | `C:\Users\afsal\OneDrive\Desktop\JailMeet2.0\legacy-media\static-reference` | `jailmeet/static-reference` | no |
| `C:\xampp\htdocs\Project\JailMeet\assets\img\clients` | `C:\Users\afsal\OneDrive\Desktop\JailMeet2.0\legacy-media\static-reference` | `jailmeet/static-reference` | no |
| `C:\xampp\htdocs\Project\JailMeet\assets\img\portfolio` | `C:\Users\afsal\OneDrive\Desktop\JailMeet2.0\legacy-media\static-reference` | `jailmeet/static-reference` | no |
| `C:\xampp\htdocs\Project\JailMeet\assets\img\team` | `C:\Users\afsal\OneDrive\Desktop\JailMeet2.0\legacy-media\static-reference` | `jailmeet/static-reference` | no |
| `C:\xampp\htdocs\Project\JailMeet\assets\img\testimonials` | `C:\Users\afsal\OneDrive\Desktop\JailMeet2.0\legacy-media\static-reference` | `jailmeet/static-reference` | no |
| `C:\xampp\htdocs\Project\JailMeet\officer` | `C:\Users\afsal\OneDrive\Desktop\JailMeet2.0\legacy-media\static-reference` | `jailmeet/static-reference` | no |
| `C:\xampp\htdocs\Project\JailMeet\officer\assets\img` | `C:\Users\afsal\OneDrive\Desktop\JailMeet2.0\legacy-media\static-reference` | `jailmeet/static-reference` | no |
| `C:\xampp\htdocs\Project\JailMeet\officer\assets\img\clients` | `C:\Users\afsal\OneDrive\Desktop\JailMeet2.0\legacy-media\static-reference` | `jailmeet/static-reference` | no |
| `C:\xampp\htdocs\Project\JailMeet\officer\assets\img\portfolio` | `C:\Users\afsal\OneDrive\Desktop\JailMeet2.0\legacy-media\static-reference` | `jailmeet/static-reference` | no |
| `C:\xampp\htdocs\Project\JailMeet\officer\assets\img\team` | `C:\Users\afsal\OneDrive\Desktop\JailMeet2.0\legacy-media\static-reference` | `jailmeet/static-reference` | no |
| `C:\xampp\htdocs\Project\JailMeet\officer\assets\img\testimonials` | `C:\Users\afsal\OneDrive\Desktop\JailMeet2.0\legacy-media\static-reference` | `jailmeet/static-reference` | no |
| `C:\xampp\htdocs\Project\JailMeet\officer\src\fonts\dropways` | `C:\Users\afsal\OneDrive\Desktop\JailMeet2.0\legacy-media\static-reference` | `jailmeet/static-reference` | no |
| `C:\xampp\htdocs\Project\JailMeet\officer\src\fonts\font-awesome\fonts` | `C:\Users\afsal\OneDrive\Desktop\JailMeet2.0\legacy-media\static-reference` | `jailmeet/static-reference` | no |
| `C:\xampp\htdocs\Project\JailMeet\officer\src\fonts\foundation-icons` | `C:\Users\afsal\OneDrive\Desktop\JailMeet2.0\legacy-media\static-reference` | `jailmeet/static-reference` | no |
| `C:\xampp\htdocs\Project\JailMeet\officer\src\fonts\ionicons-master\fonts` | `C:\Users\afsal\OneDrive\Desktop\JailMeet2.0\legacy-media\static-reference` | `jailmeet/static-reference` | no |
| `C:\xampp\htdocs\Project\JailMeet\officer\src\fonts\themify-icons\fonts` | `C:\Users\afsal\OneDrive\Desktop\JailMeet2.0\legacy-media\static-reference` | `jailmeet/static-reference` | no |
| `C:\xampp\htdocs\Project\JailMeet\officer\src\images` | `C:\Users\afsal\OneDrive\Desktop\JailMeet2.0\legacy-media\static-reference` | `jailmeet/static-reference` | no |
| `C:\xampp\htdocs\Project\JailMeet\officer\src\images\layout` | `C:\Users\afsal\OneDrive\Desktop\JailMeet2.0\legacy-media\static-reference` | `jailmeet/static-reference` | no |
| `C:\xampp\htdocs\Project\JailMeet\officer\src\plugins\datatables\images` | `C:\Users\afsal\OneDrive\Desktop\JailMeet2.0\legacy-media\static-reference` | `jailmeet/static-reference` | no |
| `C:\xampp\htdocs\Project\JailMeet\officer\src\plugins\jquery-asColorPicker\dist\images` | `C:\Users\afsal\OneDrive\Desktop\JailMeet2.0\legacy-media\static-reference` | `jailmeet/static-reference` | no |
| `C:\xampp\htdocs\Project\JailMeet\officer\src\plugins\plyr\dist` | `C:\Users\afsal\OneDrive\Desktop\JailMeet2.0\legacy-media\static-reference` | `jailmeet/static-reference` | no |
| `C:\xampp\htdocs\Project\JailMeet\officer\uploads` | `C:\Users\afsal\OneDrive\Desktop\JailMeet2.0\legacy-media\prisoners` | `jailmeet/prisoners` | yes |
| `C:\xampp\htdocs\Project\JailMeet\officer\vendors\fonts` | `C:\Users\afsal\OneDrive\Desktop\JailMeet2.0\legacy-media\static-reference` | `jailmeet/static-reference` | no |
| `C:\xampp\htdocs\Project\JailMeet\officer\vendors\images` | `C:\Users\afsal\OneDrive\Desktop\JailMeet2.0\legacy-media\static-reference` | `jailmeet/static-reference` | no |
| `C:\xampp\htdocs\Project\JailMeet\officer\vendors\images\layout` | `C:\Users\afsal\OneDrive\Desktop\JailMeet2.0\legacy-media\static-reference` | `jailmeet/static-reference` | no |
| `C:\xampp\htdocs\Project\JailMeet\prisoner\assets\flags\1x1` | `C:\Users\afsal\OneDrive\Desktop\JailMeet2.0\legacy-media\static-reference` | `jailmeet/static-reference` | no |
| `C:\xampp\htdocs\Project\JailMeet\prisoner\assets\flags\4x3` | `C:\Users\afsal\OneDrive\Desktop\JailMeet2.0\legacy-media\static-reference` | `jailmeet/static-reference` | no |
| `C:\xampp\htdocs\Project\JailMeet\prisoner\assets\fonts` | `C:\Users\afsal\OneDrive\Desktop\JailMeet2.0\legacy-media\static-reference` | `jailmeet/static-reference` | no |
| `C:\xampp\htdocs\Project\JailMeet\prisoner\assets\images` | `C:\Users\afsal\OneDrive\Desktop\JailMeet2.0\legacy-media\static-reference` | `jailmeet/static-reference` | no |
| `C:\xampp\htdocs\Project\JailMeet\prisoner\assets\images\bg-themes` | `C:\Users\afsal\OneDrive\Desktop\JailMeet2.0\legacy-media\static-reference` | `jailmeet/static-reference` | no |
| `C:\xampp\htdocs\Project\JailMeet\prisoner\assets\images\gallery` | `C:\Users\afsal\OneDrive\Desktop\JailMeet2.0\legacy-media\static-reference` | `jailmeet/static-reference` | no |
| `C:\xampp\htdocs\Project\JailMeet\prisoner\assets\images\timeline` | `C:\Users\afsal\OneDrive\Desktop\JailMeet2.0\legacy-media\static-reference` | `jailmeet/static-reference` | no |
| `C:\xampp\htdocs\Project\JailMeet\prisoner\assets1\img` | `C:\Users\afsal\OneDrive\Desktop\JailMeet2.0\legacy-media\static-reference` | `jailmeet/static-reference` | no |
| `C:\xampp\htdocs\Project\JailMeet\prisoner\assets1\img\clients` | `C:\Users\afsal\OneDrive\Desktop\JailMeet2.0\legacy-media\static-reference` | `jailmeet/static-reference` | no |
| `C:\xampp\htdocs\Project\JailMeet\prisoner\assets1\img\portfolio` | `C:\Users\afsal\OneDrive\Desktop\JailMeet2.0\legacy-media\static-reference` | `jailmeet/static-reference` | no |
| `C:\xampp\htdocs\Project\JailMeet\prisoner\assets1\img\team` | `C:\Users\afsal\OneDrive\Desktop\JailMeet2.0\legacy-media\static-reference` | `jailmeet/static-reference` | no |
| `C:\xampp\htdocs\Project\JailMeet\prisoner\assets1\img\testimonials` | `C:\Users\afsal\OneDrive\Desktop\JailMeet2.0\legacy-media\static-reference` | `jailmeet/static-reference` | no |
| `C:\xampp\htdocs\Project\JailMeet\prisoner\documentation\assets\blueprint-css\plugins\buttons\icons` | `C:\Users\afsal\OneDrive\Desktop\JailMeet2.0\legacy-media\static-reference` | `jailmeet/static-reference` | no |
| `C:\xampp\htdocs\Project\JailMeet\prisoner\documentation\assets\blueprint-css\plugins\link-icons\icons` | `C:\Users\afsal\OneDrive\Desktop\JailMeet2.0\legacy-media\static-reference` | `jailmeet/static-reference` | no |
| `C:\xampp\htdocs\Project\JailMeet\prisoner\documentation\assets\blueprint-css\src` | `C:\Users\afsal\OneDrive\Desktop\JailMeet2.0\legacy-media\static-reference` | `jailmeet/static-reference` | no |
| `C:\xampp\htdocs\Project\JailMeet\prisoner\documentation\assets\images` | `C:\Users\afsal\OneDrive\Desktop\JailMeet2.0\legacy-media\static-reference` | `jailmeet/static-reference` | no |
| `C:\xampp\htdocs\Project\JailMeet\uploads` | `C:\Users\afsal\OneDrive\Desktop\JailMeet2.0\legacy-media\documents` | `jailmeet/documents` | yes - review; no current DB/PHP reference found |
| `C:\xampp\htdocs\Project\JailMeet\visitor\assets\img` | `C:\Users\afsal\OneDrive\Desktop\JailMeet2.0\legacy-media\static-reference` | `jailmeet/static-reference` | no |
| `C:\xampp\htdocs\Project\JailMeet\visitor\assets\img\clients` | `C:\Users\afsal\OneDrive\Desktop\JailMeet2.0\legacy-media\static-reference` | `jailmeet/static-reference` | no |
| `C:\xampp\htdocs\Project\JailMeet\visitor\assets\img\portfolio` | `C:\Users\afsal\OneDrive\Desktop\JailMeet2.0\legacy-media\static-reference` | `jailmeet/static-reference` | no |
| `C:\xampp\htdocs\Project\JailMeet\visitor\assets\img\team` | `C:\Users\afsal\OneDrive\Desktop\JailMeet2.0\legacy-media\static-reference` | `jailmeet/static-reference` | no |
| `C:\xampp\htdocs\Project\JailMeet\visitor\assets\img\testimonials` | `C:\Users\afsal\OneDrive\Desktop\JailMeet2.0\legacy-media\static-reference` | `jailmeet/static-reference` | no |
| `C:\xampp\htdocs\Project\JailMeet\visitor\visitorpage\assets\img\avatars` | `C:\Users\afsal\OneDrive\Desktop\JailMeet2.0\legacy-media\static-reference` | `jailmeet/static-reference` | no |
| `C:\xampp\htdocs\Project\JailMeet\visitor\visitorpage\assets\img\backgrounds` | `C:\Users\afsal\OneDrive\Desktop\JailMeet2.0\legacy-media\static-reference` | `jailmeet/static-reference` | no |
| `C:\xampp\htdocs\Project\JailMeet\visitor\visitorpage\assets\img\elements` | `C:\Users\afsal\OneDrive\Desktop\JailMeet2.0\legacy-media\static-reference` | `jailmeet/static-reference` | no |
| `C:\xampp\htdocs\Project\JailMeet\visitor\visitorpage\assets\img\favicon` | `C:\Users\afsal\OneDrive\Desktop\JailMeet2.0\legacy-media\static-reference` | `jailmeet/static-reference` | no |
| `C:\xampp\htdocs\Project\JailMeet\visitor\visitorpage\assets\img\icons\brands` | `C:\Users\afsal\OneDrive\Desktop\JailMeet2.0\legacy-media\static-reference` | `jailmeet/static-reference` | no |
| `C:\xampp\htdocs\Project\JailMeet\visitor\visitorpage\assets\img\icons\unicons` | `C:\Users\afsal\OneDrive\Desktop\JailMeet2.0\legacy-media\static-reference` | `jailmeet/static-reference` | no |
| `C:\xampp\htdocs\Project\JailMeet\visitor\visitorpage\assets\img\illustrations` | `C:\Users\afsal\OneDrive\Desktop\JailMeet2.0\legacy-media\static-reference` | `jailmeet/static-reference` | no |
| `C:\xampp\htdocs\Project\JailMeet\visitor\visitorpage\assets\img\layouts` | `C:\Users\afsal\OneDrive\Desktop\JailMeet2.0\legacy-media\static-reference` | `jailmeet/static-reference` | no |
| `C:\xampp\htdocs\Project\JailMeet\visitor\visitorpage\assets\vendor\fonts\boxicons` | `C:\Users\afsal\OneDrive\Desktop\JailMeet2.0\legacy-media\static-reference` | `jailmeet/static-reference` | no |
| `C:\xampp\htdocs\Project\JailMeet\visitor\visitorpage\html` | `C:\Users\afsal\OneDrive\Desktop\JailMeet2.0\legacy-media\static-reference` | `jailmeet/static-reference` | no |
| `C:\xampp\htdocs\Project\JailMeet\visitor\visitorpage\html\slideshow` | `C:\Users\afsal\OneDrive\Desktop\JailMeet2.0\legacy-media\static-reference` | `jailmeet/static-reference` | no |

## Safe Migration Plan

| Old folder path | Media type | Purpose | Used by files | New folder path | Should migrate? |
| --- | --- | --- | --- | --- | --- |
| `C:\xampp\htdocs\Project\JailMeet` | `.jpg and related` | Landing page, brand, team, demo video assets | index.php; visitor/login.php; visitor/register.php; prisoner/prisonerlogin.php; prisoner/sidebar.php | `C:\Users\afsal\OneDrive\Desktop\JailMeet2.0\legacy-media\videos` | no |
| `C:\xampp\htdocs\Project\JailMeet\admin` | `.png and related` | Static UI/media assets | Mostly static template references or no direct references found | `C:\Users\afsal\OneDrive\Desktop\JailMeet2.0\legacy-media\static-reference` | no |
| `C:\xampp\htdocs\Project\JailMeet\admin\assets\img` | `.jpg and related` | Theme/vendor/static UI assets | index/static pages/includes in root/admin/officer/prisoner/visitor; CSS background references | `C:\Users\afsal\OneDrive\Desktop\JailMeet2.0\legacy-media\static-reference` | no |
| `C:\xampp\htdocs\Project\JailMeet\admin\assets\img\clients` | `.png and related` | Theme/vendor/static UI assets | index/static pages/includes in root/admin/officer/prisoner/visitor; CSS background references | `C:\Users\afsal\OneDrive\Desktop\JailMeet2.0\legacy-media\static-reference` | no |
| `C:\xampp\htdocs\Project\JailMeet\admin\assets\img\portfolio` | `.jpg and related` | Theme/vendor/static UI assets | index/static pages/includes in root/admin/officer/prisoner/visitor; CSS background references | `C:\Users\afsal\OneDrive\Desktop\JailMeet2.0\legacy-media\static-reference` | no |
| `C:\xampp\htdocs\Project\JailMeet\admin\assets\img\team` | `.jpg and related` | Theme/vendor/static UI assets | index/static pages/includes in root/admin/officer/prisoner/visitor; CSS background references | `C:\Users\afsal\OneDrive\Desktop\JailMeet2.0\legacy-media\static-reference` | no |
| `C:\xampp\htdocs\Project\JailMeet\admin\assets\img\testimonials` | `.jpg and related` | Theme/vendor/static UI assets | index/static pages/includes in root/admin/officer/prisoner/visitor; CSS background references | `C:\Users\afsal\OneDrive\Desktop\JailMeet2.0\legacy-media\static-reference` | no |
| `C:\xampp\htdocs\Project\JailMeet\admin\assets1\fonts\fontawesome` | `.svg and related` | Theme/vendor/static UI assets | admin/*.php; admin/includes/navbar.php; Kaiadmin/static dashboard pages | `C:\Users\afsal\OneDrive\Desktop\JailMeet2.0\legacy-media\static-reference` | no |
| `C:\xampp\htdocs\Project\JailMeet\admin\assets1\fonts\simple-line-icons` | `.svg and related` | Theme/vendor/static UI assets | admin/*.php; admin/includes/navbar.php; Kaiadmin/static dashboard pages | `C:\Users\afsal\OneDrive\Desktop\JailMeet2.0\legacy-media\static-reference` | no |
| `C:\xampp\htdocs\Project\JailMeet\admin\assets1\img` | `.jpg and related` | Theme/vendor/static UI assets | admin/*.php; admin/includes/navbar.php; Kaiadmin/static dashboard pages | `C:\Users\afsal\OneDrive\Desktop\JailMeet2.0\legacy-media\static-reference` | no |
| `C:\xampp\htdocs\Project\JailMeet\admin\assets1\img\examples` | `.jpg and related` | Theme/vendor/static UI assets | admin/*.php; admin/includes/navbar.php; Kaiadmin/static dashboard pages | `C:\Users\afsal\OneDrive\Desktop\JailMeet2.0\legacy-media\static-reference` | no |
| `C:\xampp\htdocs\Project\JailMeet\admin\assets1\img\flags` | `.png and related` | Theme/vendor/static UI assets | admin/*.php; admin/includes/navbar.php; Kaiadmin/static dashboard pages | `C:\Users\afsal\OneDrive\Desktop\JailMeet2.0\legacy-media\static-reference` | no |
| `C:\xampp\htdocs\Project\JailMeet\admin\assets1\img\kaiadmin` | `.png and related` | Theme/vendor/static UI assets | admin/*.php; admin/includes/navbar.php; Kaiadmin/static dashboard pages | `C:\Users\afsal\OneDrive\Desktop\JailMeet2.0\legacy-media\static-reference` | no |
| `C:\xampp\htdocs\Project\JailMeet\admin\assets1\img\undraw` | `.svg and related` | Theme/vendor/static UI assets | admin/*.php; admin/includes/navbar.php; Kaiadmin/static dashboard pages | `C:\Users\afsal\OneDrive\Desktop\JailMeet2.0\legacy-media\static-reference` | no |
| `C:\xampp\htdocs\Project\JailMeet\admin\assets1\js\plugin\owl-carousel` | `.png and related` | Theme/vendor/static UI assets | admin/*.php; admin/includes/navbar.php; Kaiadmin/static dashboard pages | `C:\Users\afsal\OneDrive\Desktop\JailMeet2.0\legacy-media\static-reference` | no |
| `C:\xampp\htdocs\Project\JailMeet\assets\img` | `.jpg and related` | Theme/vendor/static UI assets | index/static pages/includes in root/admin/officer/prisoner/visitor; CSS background references | `C:\Users\afsal\OneDrive\Desktop\JailMeet2.0\legacy-media\static-reference` | no |
| `C:\xampp\htdocs\Project\JailMeet\assets\img\clients` | `.png and related` | Theme/vendor/static UI assets | index/static pages/includes in root/admin/officer/prisoner/visitor; CSS background references | `C:\Users\afsal\OneDrive\Desktop\JailMeet2.0\legacy-media\static-reference` | no |
| `C:\xampp\htdocs\Project\JailMeet\assets\img\portfolio` | `.jpg and related` | Theme/vendor/static UI assets | index/static pages/includes in root/admin/officer/prisoner/visitor; CSS background references | `C:\Users\afsal\OneDrive\Desktop\JailMeet2.0\legacy-media\static-reference` | no |
| `C:\xampp\htdocs\Project\JailMeet\assets\img\team` | `.jpg and related` | Theme/vendor/static UI assets | index/static pages/includes in root/admin/officer/prisoner/visitor; CSS background references | `C:\Users\afsal\OneDrive\Desktop\JailMeet2.0\legacy-media\static-reference` | no |
| `C:\xampp\htdocs\Project\JailMeet\assets\img\testimonials` | `.jpg and related` | Theme/vendor/static UI assets | index/static pages/includes in root/admin/officer/prisoner/visitor; CSS background references | `C:\Users\afsal\OneDrive\Desktop\JailMeet2.0\legacy-media\static-reference` | no |
| `C:\xampp\htdocs\Project\JailMeet\officer` | `.png and related` | Static UI/media assets | Mostly static template references or no direct references found | `C:\Users\afsal\OneDrive\Desktop\JailMeet2.0\legacy-media\static-reference` | no |
| `C:\xampp\htdocs\Project\JailMeet\officer\assets\img` | `.jpg and related` | Theme/vendor/static UI assets | index/static pages/includes in root/admin/officer/prisoner/visitor; CSS background references | `C:\Users\afsal\OneDrive\Desktop\JailMeet2.0\legacy-media\static-reference` | no |
| `C:\xampp\htdocs\Project\JailMeet\officer\assets\img\clients` | `.png and related` | Theme/vendor/static UI assets | index/static pages/includes in root/admin/officer/prisoner/visitor; CSS background references | `C:\Users\afsal\OneDrive\Desktop\JailMeet2.0\legacy-media\static-reference` | no |
| `C:\xampp\htdocs\Project\JailMeet\officer\assets\img\portfolio` | `.jpg and related` | Theme/vendor/static UI assets | index/static pages/includes in root/admin/officer/prisoner/visitor; CSS background references | `C:\Users\afsal\OneDrive\Desktop\JailMeet2.0\legacy-media\static-reference` | no |
| `C:\xampp\htdocs\Project\JailMeet\officer\assets\img\team` | `.jpg and related` | Theme/vendor/static UI assets | index/static pages/includes in root/admin/officer/prisoner/visitor; CSS background references | `C:\Users\afsal\OneDrive\Desktop\JailMeet2.0\legacy-media\static-reference` | no |
| `C:\xampp\htdocs\Project\JailMeet\officer\assets\img\testimonials` | `.jpg and related` | Theme/vendor/static UI assets | index/static pages/includes in root/admin/officer/prisoner/visitor; CSS background references | `C:\Users\afsal\OneDrive\Desktop\JailMeet2.0\legacy-media\static-reference` | no |
| `C:\xampp\htdocs\Project\JailMeet\officer\src\fonts\dropways` | `.svg and related` | Theme/vendor/static UI assets | officer template source/demo files | `C:\Users\afsal\OneDrive\Desktop\JailMeet2.0\legacy-media\static-reference` | no |
| `C:\xampp\htdocs\Project\JailMeet\officer\src\fonts\font-awesome\fonts` | `.svg and related` | Theme/vendor/static UI assets | officer template source/demo files | `C:\Users\afsal\OneDrive\Desktop\JailMeet2.0\legacy-media\static-reference` | no |
| `C:\xampp\htdocs\Project\JailMeet\officer\src\fonts\foundation-icons` | `.svg and related` | Theme/vendor/static UI assets | officer template source/demo files | `C:\Users\afsal\OneDrive\Desktop\JailMeet2.0\legacy-media\static-reference` | no |
| `C:\xampp\htdocs\Project\JailMeet\officer\src\fonts\ionicons-master\fonts` | `.svg and related` | Theme/vendor/static UI assets | officer template source/demo files | `C:\Users\afsal\OneDrive\Desktop\JailMeet2.0\legacy-media\static-reference` | no |
| `C:\xampp\htdocs\Project\JailMeet\officer\src\fonts\themify-icons\fonts` | `.svg and related` | Theme/vendor/static UI assets | officer template source/demo files | `C:\Users\afsal\OneDrive\Desktop\JailMeet2.0\legacy-media\static-reference` | no |
| `C:\xampp\htdocs\Project\JailMeet\officer\src\images` | `.jpg and related` | Theme/vendor/static UI assets | officer template source/demo files | `C:\Users\afsal\OneDrive\Desktop\JailMeet2.0\legacy-media\static-reference` | no |
| `C:\xampp\htdocs\Project\JailMeet\officer\src\images\layout` | `.png and related` | Theme/vendor/static UI assets | officer template source/demo files | `C:\Users\afsal\OneDrive\Desktop\JailMeet2.0\legacy-media\static-reference` | no |
| `C:\xampp\htdocs\Project\JailMeet\officer\src\plugins\datatables\images` | `.png and related` | Theme/vendor/static UI assets | officer template source/demo files | `C:\Users\afsal\OneDrive\Desktop\JailMeet2.0\legacy-media\static-reference` | no |
| `C:\xampp\htdocs\Project\JailMeet\officer\src\plugins\jquery-asColorPicker\dist\images` | `.png and related` | Theme/vendor/static UI assets | officer template source/demo files | `C:\Users\afsal\OneDrive\Desktop\JailMeet2.0\legacy-media\static-reference` | no |
| `C:\xampp\htdocs\Project\JailMeet\officer\src\plugins\plyr\dist` | `.svg and related` | Theme/vendor/static UI assets | officer template source/demo files | `C:\Users\afsal\OneDrive\Desktop\JailMeet2.0\legacy-media\static-reference` | no |
| `C:\xampp\htdocs\Project\JailMeet\officer\uploads` | `.jpg and related` | Prisoner profile photos referenced by prisoner.dp | officer/prisoners.php; admin/prisonerdetails.php; prisoner/index.php; prisoner/navbar.php; visitor/visitorpage/html/prisoners.php | `C:\Users\afsal\OneDrive\Desktop\JailMeet2.0\legacy-media\prisoners` | yes |
| `C:\xampp\htdocs\Project\JailMeet\officer\vendors\fonts` | `.svg and related` | Theme/vendor/static UI assets | Mostly static template references or no direct references found | `C:\Users\afsal\OneDrive\Desktop\JailMeet2.0\legacy-media\static-reference` | no |
| `C:\xampp\htdocs\Project\JailMeet\officer\vendors\images` | `.jpg and related` | Theme/vendor/static UI assets | officer/*.php and officer/*.html DeskApp template pages | `C:\Users\afsal\OneDrive\Desktop\JailMeet2.0\legacy-media\static-reference` | no |
| `C:\xampp\htdocs\Project\JailMeet\officer\vendors\images\layout` | `.png and related` | Theme/vendor/static UI assets | officer/*.php and officer/*.html DeskApp template pages | `C:\Users\afsal\OneDrive\Desktop\JailMeet2.0\legacy-media\static-reference` | no |
| `C:\xampp\htdocs\Project\JailMeet\prisoner\assets\flags\1x1` | `.svg and related` | Theme/vendor/static UI assets | prisoner/*.php, prisoner/*.html, prisoner/documentation/*.html | `C:\Users\afsal\OneDrive\Desktop\JailMeet2.0\legacy-media\static-reference` | no |
| `C:\xampp\htdocs\Project\JailMeet\prisoner\assets\flags\4x3` | `.svg and related` | Theme/vendor/static UI assets | prisoner/*.php, prisoner/*.html, prisoner/documentation/*.html | `C:\Users\afsal\OneDrive\Desktop\JailMeet2.0\legacy-media\static-reference` | no |
| `C:\xampp\htdocs\Project\JailMeet\prisoner\assets\fonts` | `.svg and related` | Theme/vendor/static UI assets | prisoner/*.php, prisoner/*.html, prisoner/documentation/*.html | `C:\Users\afsal\OneDrive\Desktop\JailMeet2.0\legacy-media\static-reference` | no |
| `C:\xampp\htdocs\Project\JailMeet\prisoner\assets\images` | `.png and related` | Theme/vendor/static UI assets | prisoner/*.php, prisoner/*.html, prisoner/documentation/*.html | `C:\Users\afsal\OneDrive\Desktop\JailMeet2.0\legacy-media\static-reference` | no |
| `C:\xampp\htdocs\Project\JailMeet\prisoner\assets\images\bg-themes` | `.png and related` | Theme/vendor/static UI assets | prisoner/*.php, prisoner/*.html, prisoner/documentation/*.html | `C:\Users\afsal\OneDrive\Desktop\JailMeet2.0\legacy-media\static-reference` | no |
| `C:\xampp\htdocs\Project\JailMeet\prisoner\assets\images\gallery` | `.svg and related` | Theme/vendor/static UI assets | prisoner/*.php, prisoner/*.html, prisoner/documentation/*.html | `C:\Users\afsal\OneDrive\Desktop\JailMeet2.0\legacy-media\static-reference` | no |
| `C:\xampp\htdocs\Project\JailMeet\prisoner\assets\images\timeline` | `.svg and related` | Theme/vendor/static UI assets | prisoner/*.php, prisoner/*.html, prisoner/documentation/*.html | `C:\Users\afsal\OneDrive\Desktop\JailMeet2.0\legacy-media\static-reference` | no |
| `C:\xampp\htdocs\Project\JailMeet\prisoner\assets1\img` | `.jpg and related` | Theme/vendor/static UI assets | prisoner/*.php, prisoner/*.html, prisoner/documentation/*.html | `C:\Users\afsal\OneDrive\Desktop\JailMeet2.0\legacy-media\static-reference` | no |
| `C:\xampp\htdocs\Project\JailMeet\prisoner\assets1\img\clients` | `.png and related` | Theme/vendor/static UI assets | prisoner/*.php, prisoner/*.html, prisoner/documentation/*.html | `C:\Users\afsal\OneDrive\Desktop\JailMeet2.0\legacy-media\static-reference` | no |
| `C:\xampp\htdocs\Project\JailMeet\prisoner\assets1\img\portfolio` | `.jpg and related` | Theme/vendor/static UI assets | prisoner/*.php, prisoner/*.html, prisoner/documentation/*.html | `C:\Users\afsal\OneDrive\Desktop\JailMeet2.0\legacy-media\static-reference` | no |
| `C:\xampp\htdocs\Project\JailMeet\prisoner\assets1\img\team` | `.jpg and related` | Theme/vendor/static UI assets | prisoner/*.php, prisoner/*.html, prisoner/documentation/*.html | `C:\Users\afsal\OneDrive\Desktop\JailMeet2.0\legacy-media\static-reference` | no |
| `C:\xampp\htdocs\Project\JailMeet\prisoner\assets1\img\testimonials` | `.jpg and related` | Theme/vendor/static UI assets | prisoner/*.php, prisoner/*.html, prisoner/documentation/*.html | `C:\Users\afsal\OneDrive\Desktop\JailMeet2.0\legacy-media\static-reference` | no |
| `C:\xampp\htdocs\Project\JailMeet\prisoner\documentation\assets\blueprint-css\plugins\buttons\icons` | `.png and related` | Theme/vendor/static UI assets | Mostly static template references or no direct references found | `C:\Users\afsal\OneDrive\Desktop\JailMeet2.0\legacy-media\static-reference` | no |
| `C:\xampp\htdocs\Project\JailMeet\prisoner\documentation\assets\blueprint-css\plugins\link-icons\icons` | `.png and related` | Theme/vendor/static UI assets | Mostly static template references or no direct references found | `C:\Users\afsal\OneDrive\Desktop\JailMeet2.0\legacy-media\static-reference` | no |
| `C:\xampp\htdocs\Project\JailMeet\prisoner\documentation\assets\blueprint-css\src` | `.png and related` | Theme/vendor/static UI assets | Mostly static template references or no direct references found | `C:\Users\afsal\OneDrive\Desktop\JailMeet2.0\legacy-media\static-reference` | no |
| `C:\xampp\htdocs\Project\JailMeet\prisoner\documentation\assets\images` | `.png and related` | Theme/vendor/static UI assets | Mostly static template references or no direct references found | `C:\Users\afsal\OneDrive\Desktop\JailMeet2.0\legacy-media\static-reference` | no |
| `C:\xampp\htdocs\Project\JailMeet\uploads` | `.jpg and related` | General uploaded image folder found on disk; no PHP references found in current code | No PHP/HTML/CSS references found | `C:\Users\afsal\OneDrive\Desktop\JailMeet2.0\legacy-media\documents` | yes - review; no current DB/PHP reference found |
| `C:\xampp\htdocs\Project\JailMeet\visitor\assets\img` | `.jpg and related` | Theme/vendor/static UI assets | index/static pages/includes in root/admin/officer/prisoner/visitor; CSS background references | `C:\Users\afsal\OneDrive\Desktop\JailMeet2.0\legacy-media\static-reference` | no |
| `C:\xampp\htdocs\Project\JailMeet\visitor\assets\img\clients` | `.png and related` | Theme/vendor/static UI assets | index/static pages/includes in root/admin/officer/prisoner/visitor; CSS background references | `C:\Users\afsal\OneDrive\Desktop\JailMeet2.0\legacy-media\static-reference` | no |
| `C:\xampp\htdocs\Project\JailMeet\visitor\assets\img\portfolio` | `.jpg and related` | Theme/vendor/static UI assets | index/static pages/includes in root/admin/officer/prisoner/visitor; CSS background references | `C:\Users\afsal\OneDrive\Desktop\JailMeet2.0\legacy-media\static-reference` | no |
| `C:\xampp\htdocs\Project\JailMeet\visitor\assets\img\team` | `.jpg and related` | Theme/vendor/static UI assets | index/static pages/includes in root/admin/officer/prisoner/visitor; CSS background references | `C:\Users\afsal\OneDrive\Desktop\JailMeet2.0\legacy-media\static-reference` | no |
| `C:\xampp\htdocs\Project\JailMeet\visitor\assets\img\testimonials` | `.jpg and related` | Theme/vendor/static UI assets | index/static pages/includes in root/admin/officer/prisoner/visitor; CSS background references | `C:\Users\afsal\OneDrive\Desktop\JailMeet2.0\legacy-media\static-reference` | no |
| `C:\xampp\htdocs\Project\JailMeet\visitor\visitorpage\assets\img\avatars` | `.png and related` | Theme/vendor/static UI assets | index/static pages/includes in root/admin/officer/prisoner/visitor; CSS background references | `C:\Users\afsal\OneDrive\Desktop\JailMeet2.0\legacy-media\static-reference` | no |
| `C:\xampp\htdocs\Project\JailMeet\visitor\visitorpage\assets\img\backgrounds` | `.jpg and related` | Theme/vendor/static UI assets | index/static pages/includes in root/admin/officer/prisoner/visitor; CSS background references | `C:\Users\afsal\OneDrive\Desktop\JailMeet2.0\legacy-media\static-reference` | no |
| `C:\xampp\htdocs\Project\JailMeet\visitor\visitorpage\assets\img\elements` | `.jpg and related` | Theme/vendor/static UI assets | index/static pages/includes in root/admin/officer/prisoner/visitor; CSS background references | `C:\Users\afsal\OneDrive\Desktop\JailMeet2.0\legacy-media\static-reference` | no |
| `C:\xampp\htdocs\Project\JailMeet\visitor\visitorpage\assets\img\favicon` | `.ico and related` | Theme/vendor/static UI assets | index/static pages/includes in root/admin/officer/prisoner/visitor; CSS background references | `C:\Users\afsal\OneDrive\Desktop\JailMeet2.0\legacy-media\static-reference` | no |
| `C:\xampp\htdocs\Project\JailMeet\visitor\visitorpage\assets\img\icons\brands` | `.png and related` | Theme/vendor/static UI assets | index/static pages/includes in root/admin/officer/prisoner/visitor; CSS background references | `C:\Users\afsal\OneDrive\Desktop\JailMeet2.0\legacy-media\static-reference` | no |
| `C:\xampp\htdocs\Project\JailMeet\visitor\visitorpage\assets\img\icons\unicons` | `.png and related` | Theme/vendor/static UI assets | index/static pages/includes in root/admin/officer/prisoner/visitor; CSS background references | `C:\Users\afsal\OneDrive\Desktop\JailMeet2.0\legacy-media\static-reference` | no |
| `C:\xampp\htdocs\Project\JailMeet\visitor\visitorpage\assets\img\illustrations` | `.png and related` | Theme/vendor/static UI assets | index/static pages/includes in root/admin/officer/prisoner/visitor; CSS background references | `C:\Users\afsal\OneDrive\Desktop\JailMeet2.0\legacy-media\static-reference` | no |
| `C:\xampp\htdocs\Project\JailMeet\visitor\visitorpage\assets\img\layouts` | `.png and related` | Theme/vendor/static UI assets | index/static pages/includes in root/admin/officer/prisoner/visitor; CSS background references | `C:\Users\afsal\OneDrive\Desktop\JailMeet2.0\legacy-media\static-reference` | no |
| `C:\xampp\htdocs\Project\JailMeet\visitor\visitorpage\assets\vendor\fonts\boxicons` | `.svg and related` | Theme/vendor/static UI assets | visitor/visitorpage/html/*.php and HTML dashboard pages | `C:\Users\afsal\OneDrive\Desktop\JailMeet2.0\legacy-media\static-reference` | no |
| `C:\xampp\htdocs\Project\JailMeet\visitor\visitorpage\html` | `.png and related` | Static UI/media assets | Mostly static template references or no direct references found | `C:\Users\afsal\OneDrive\Desktop\JailMeet2.0\legacy-media\static-reference` | no |
| `C:\xampp\htdocs\Project\JailMeet\visitor\visitorpage\html\slideshow` | `.jpg and related` | Static UI/media assets | Mostly static template references or no direct references found | `C:\Users\afsal\OneDrive\Desktop\JailMeet2.0\legacy-media\static-reference` | no |

## Generated PowerShell Copy Commands For `Should migrate: yes` Folders

### `C:\xampp\htdocs\Project\JailMeet\officer\uploads` -> `C:\Users\afsal\OneDrive\Desktop\JailMeet2.0\legacy-media\prisoners`
```powershell
New-Item -ItemType Directory -Force "C:\Users\afsal\OneDrive\Desktop\JailMeet2.0\legacy-media\prisoners"
Copy-Item "C:\xampp\htdocs\Project\JailMeet\officer\uploads\*" "C:\Users\afsal\OneDrive\Desktop\JailMeet2.0\legacy-media\prisoners" -Recurse -Force
```

### `C:\xampp\htdocs\Project\JailMeet\uploads` -> `C:\Users\afsal\OneDrive\Desktop\JailMeet2.0\legacy-media\documents`
```powershell
New-Item -ItemType Directory -Force "C:\Users\afsal\OneDrive\Desktop\JailMeet2.0\legacy-media\documents"
Copy-Item "C:\xampp\htdocs\Project\JailMeet\uploads\*" "C:\Users\afsal\OneDrive\Desktop\JailMeet2.0\legacy-media\documents" -Recurse -Force
```

## Notes And Risks

- `officer/uploads` is the only folder with direct upload/write code found via `move_uploaded_file`.
- Root `uploads` has 3 JPGs with generated names but no current references. I recommend migrating them to `legacy-media/documents` as review material, then deciding whether they belong to cases/FIRs or can be discarded.
- `officer/uploads/profilepics` does not exist. `visitor/profilepics` exists but is empty.
- No `.pdf`, `.doc`, or `.docx` files were found under the old project root.
- No code was changed and no copy commands were executed.
