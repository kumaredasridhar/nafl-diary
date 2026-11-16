#!/usr/bin/env python3
"""
Generate valid standalone PDF sample artefacts for NAFL testing.
No external dependencies required (pure standard library).
"""
import os
import shutil

class SimplePDF:
    def __init__(self):
        self.pages = []
        self.current_page_commands = []
        
    def add_page(self):
        if self.current_page_commands:
            self.pages.append("\n".join(self.current_page_commands))
            self.current_page_commands = []
            
    def text(self, x, y, string, size=12, font="F1"):
        # Escape parenthesis
        safe = string.replace("\\", "\\\\").replace("(", "\\(").replace(")", "\\)")
        self.current_page_commands.append(f"BT /{font} {size} Tf {x} {y} Td ({safe}) Tj ET")
        
    def rect(self, x, y, w, h, fill=False, stroke=True):
        cmd = f"{x} {y} {w} {h} re"
        if fill and stroke:
            cmd += " B"
        elif fill:
            cmd += " f"
        elif stroke:
            cmd += " S"
        self.current_page_commands.append(cmd)
        
    def line(self, x1, y1, x2, y2):
        self.current_page_commands.append(f"{x1} {y1} m {x2} {y2} l S")
        
    def color(self, r, g, b, stroke=True, fill=True):
        if fill:
            self.current_page_commands.append(f"{r:.3f} {g:.3f} {b:.3f} rg")
        if stroke:
            self.current_page_commands.append(f"{r:.3f} {g:.3f} {b:.3f} RG")

    def text_color(self, r, g, b):
        self.current_page_commands.append(f"{r:.3f} {g:.3f} {b:.3f} rg")

    def build(self) -> bytes:
        if self.current_page_commands:
            self.pages.append("\n".join(self.current_page_commands))
            self.current_page_commands = []
            
        objs = []
        # obj 1: Catalog
        # obj 2: Pages
        # obj 3..2+N: Page
        # obj 3+N..2+2N: Contents
        # obj last: Font
        num_pages = len(self.pages)
        page_obj_ids = [3 + i for i in range(num_pages)]
        content_obj_ids = [3 + num_pages + i for i in range(num_pages)]
        font_obj_id = 3 + 2 * num_pages
        font_bold_id = font_obj_id + 1
        
        body = []
        body.append(b"%PDF-1.4\n")
        
        # 1: Catalog
        objs.append(f"1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n".encode('ascii'))
        
        # 2: Pages
        kids = " ".join([f"{pid} 0 R" for pid in page_obj_ids])
        objs.append(f"2 0 obj\n<< /Type /Pages /Kids [{kids}] /Count {num_pages} >>\nendobj\n".encode('ascii'))
        
        # Page objects
        for i in range(num_pages):
            pid = page_obj_ids[i]
            cid = content_obj_ids[i]
            page_str = (
                f"{pid} 0 obj\n"
                f"<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792]\n"
                f"   /Contents {cid} 0 R\n"
                f"   /Resources << /Font << /F1 {font_obj_id} 0 R /F2 {font_bold_id} 0 R >> >>\n"
                f">>\nendobj\n"
            )
            objs.append(page_str.encode('ascii'))
            
        # Content stream objects
        for i in range(num_pages):
            cid = content_obj_ids[i]
            stream_data = self.pages[i].encode('utf-8')
            stream_str = (
                f"{cid} 0 obj\n<< /Length {len(stream_data)} >>\nstream\n"
            ).encode('ascii') + stream_data + b"\nendstream\nendobj\n"
            objs.append(stream_str)
            
        # Fonts
        objs.append(f"{font_obj_id} 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n".encode('ascii'))
        objs.append(f"{font_bold_id} 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj\n".encode('ascii'))
        
        # Write offsets
        offsets = [0]
        cur_offset = len(body[0])
        for obj in objs:
            offsets.append(cur_offset)
            cur_offset += len(obj)
            body.append(obj)
            
        xref_offset = cur_offset
        total_objs = len(objs) + 1
        xref = f"xref\n0 {total_objs}\n0000000000 65535 f \n"
        for off in offsets[1:]:
            xref += f"{off:010d} 00000 n \n"
            
        trailer = (
            f"trailer\n<< /Size {total_objs} /Root 1 0 R >>\n"
            f"startxref\n{xref_offset}\n%%EOF\n"
        )
        body.append(xref.encode('ascii'))
        body.append(trailer.encode('ascii'))
        return b"".join(body)


def create_circular_pdf(path):
    pdf = SimplePDF()
    # Header branding
    pdf.color(0.01, 0.41, 0.63, fill=True, stroke=False) # NAFL Brand Blue
    pdf.rect(40, 720, 532, 45, fill=True, stroke=False)
    
    pdf.text_color(1, 1, 1)
    pdf.text(55, 742, "NATIONAL ACADEMY FOR LEARNING (NAFL)", size=16, font="F2")
    pdf.text(55, 728, "Basaveshwarnagar, Bengaluru | Affiliated to CISCE & CAIE", size=9, font="F1")
    
    # Circular metadata box
    pdf.color(0.95, 0.96, 0.98, fill=True, stroke=False)
    pdf.color(0.85, 0.88, 0.92, fill=False, stroke=True)
    pdf.rect(40, 645, 532, 55, fill=True, stroke=True)
    
    pdf.text_color(0.1, 0.15, 0.25)
    pdf.text(55, 680, "CIRCULAR NO: CIR/2026-27/025", size=11, font="F2")
    pdf.text(55, 665, "DATE: 12 November 2026", size=10, font="F1")
    pdf.text(320, 680, "TARGET: Montessori 1, Mont 2 & Grade 1", size=10, font="F2")
    pdf.text(320, 665, "CATEGORY: Sports & Annual Athletic Meet", size=10, font="F1")
    
    # Subject
    pdf.text_color(0.01, 0.41, 0.63)
    pdf.text(40, 615, "SUBJECT: Annual Junior Athletic Meet 2026-2027 & Parent Consent Slip", size=12, font="F2")
    
    # Body text
    pdf.text_color(0.15, 0.2, 0.25)
    y = 585
    lines = [
        "Dear Parents,",
        "",
        "We are pleased to announce that our Annual Junior Athletic Meet for Montessori and Primary",
        "sections will be held on Saturday, 19th December 2026 at the NAFL Campus Sports Grounds.",
        "",
        "Event Highlights for Montessori 1:",
        "  - 25m Fun Dash & Obstacle Balancing Crawl",
        "  - Color Sorting Relay & Ring Toss Activity",
        "  - Parent-Child Bonding 3-Legged Fun Walk",
        "",
        "Dress Code & Requirements:",
        "  - Student House Color T-shirt (Ruby / Sapphire / Emerald / Amber) with navy shorts",
        "  - Comfortable running sports shoes and labeled NAFL sun cap",
        "  - Please send a labeled water bottle and healthy fruit snack box",
        "",
        "Timings: 08:30 AM to 11:30 AM (Children must be dropped at Gate 2 by 08:15 AM).",
        "",
        "Parent Digital Acknowledgement Required:",
        "Kindly acknowledge and sign the digital consent receipt via the NAFL School Portal by Friday,",
        "27th November 2026 to confirm your child's participation and t-shirt size reservation.",
        "",
        "Warm regards,",
        "Office of the Principal & Physical Education Department",
        "National Academy For Learning"
    ]
    for line in lines:
        if line.startswith("Dear") or line.startswith("Event Highlights") or line.startswith("Dress Code") or line.startswith("Parent Digital"):
            pdf.text_color(0.08, 0.12, 0.18)
            pdf.text(40, y, line, size=10, font="F2")
        else:
            pdf.text_color(0.18, 0.22, 0.28)
            pdf.text(40, y, line, size=9.5, font="F1")
        y -= 16
        
    # Signature box at bottom
    pdf.color(0.98, 0.95, 0.90, fill=True, stroke=False)
    pdf.color(0.95, 0.8, 0.6, fill=False, stroke=True)
    pdf.rect(40, 100, 532, 50, fill=True, stroke=True)
    pdf.text_color(0.65, 0.35, 0.05)
    pdf.text(55, 130, "[ DIGITAL SIGNATURE SLIP ]", size=10, font="F2")
    pdf.text_color(0.45, 0.25, 0.1)
    pdf.text(55, 115, "Parent digital signature tracked automatically via NAFL Portal. No paper return needed.", size=9, font="F1")
    
    with open(path, "wb") as f:
        f.write(pdf.build())


def create_curriculum_deck_pdf(path):
    pdf = SimplePDF()
    
    # Page 1: Cover Slide
    pdf.color(0.01, 0.41, 0.63, fill=True, stroke=False)
    pdf.rect(30, 30, 552, 732, fill=True, stroke=False)
    
    pdf.text_color(1, 1, 1)
    pdf.text(60, 520, "NATIONAL ACADEMY FOR LEARNING", size=20, font="F2")
    pdf.text(60, 480, "Montessori 1 — Monthly Curriculum Plan", size=16, font="F1")
    pdf.text(60, 430, "DECEMBER 2026", size=32, font="F2")
    pdf.text(60, 390, 'Monthly Theme: "Winter Wonders, Frost & Festive Helpers"', size=14, font="F2")
    
    pdf.text_color(0.85, 0.92, 1.0)
    pdf.text(60, 320, "Class Teacher: Ms. Ananya | Room 102", size=12, font="F1")
    pdf.text(60, 300, "Assimilated for Parents: Learning Objectives, Dress-Up Days & Material Guides", size=11, font="F1")
    pdf.add_page()
    
    # Page 2: Learning Objectives
    pdf.color(0.01, 0.41, 0.63, fill=True, stroke=False)
    pdf.rect(30, 720, 552, 42, fill=True, stroke=False)
    pdf.text_color(1, 1, 1)
    pdf.text(50, 735, "DECEMBER 2026 — CORE LEARNING OBJECTIVES", size=14, font="F2")
    
    y = 670
    sections = [
        ("Sensorial & Mathematics", [
            "Introduction of Number Rods 1 to 10 (Quantities and numeric names)",
            "Sandpaper numbers tactile tracing (0 to 5) with left-to-right tracking",
            "Broad Stair and Pink Tower combined grading explorations",
            "Color Box 3: Pairing shades of white, ice blue, and evergreen"
        ]),
        ("Language & Phonics", [
            "Phonetic sound recognition for letters: /c/, /k/, /e/, /h/",
            "Object box sound association: Cup, Kite, Egg, Hat",
            "Rhyme and storytelling: 'Five Little Snowflakes' and 'Jingle Bells'",
            "Three-period lesson for Winter vocabulary cards"
        ]),
        ("Practical Life Exercises", [
            "Transferring cotton balls with wooden tongs (Fine motor grip)",
            "Folding winter napkins and mittens along marked center lines",
            "Pouring warm water into wide-mouth glasses without spilling",
            "Buttoning frames: Fastening medium coat buttons independently"
        ])
    ]
    for title, items in sections:
        pdf.text_color(0.01, 0.41, 0.63)
        pdf.text(50, y, title, size=12, font="F2")
        y -= 20
        pdf.text_color(0.15, 0.2, 0.25)
        for it in items:
            pdf.text(65, y, f"- {it}", size=10, font="F1")
            y -= 17
        y -= 15
    pdf.add_page()
    
    # Page 3: Key Dates & Dress Code
    pdf.color(0.01, 0.41, 0.63, fill=True, stroke=False)
    pdf.rect(30, 720, 552, 42, fill=True, stroke=False)
    pdf.text_color(1, 1, 1)
    pdf.text(50, 735, "KEY DATES, DRESS CODES & WHAT TO BRING", size=14, font="F2")
    
    dates = [
        ("Saturday, 05 Dec 2026", "Parent-Teacher Meeting (Term 1 PTM)", "Regular parent attire", "Developmental milestones report review. Book your 15-min slot in portal."),
        ("Friday, 18 Dec 2026", "Christmas & Winter Carol Circle", "Dress up in Red, White, or Green festive wear", "Bring one small wrapped storybook (under Rs 100) for Secret Santa book exchange."),
        ("Tuesday, 22 Dec 2026", "Gingerbread & Cookie Decoration Day", "Aprons provided in class", "Bring 1 small child-safe cookie cutter of any winter shape."),
        ("Wednesday, 23 Dec 2026", "Winter Vacation Commences", "School closes for winter holidays", "School reopens on Monday, 04 January 2027.")
    ]
    y = 660
    for d, title, dress, bring in dates:
        pdf.color(0.95, 0.97, 1.0, fill=True, stroke=False)
        pdf.color(0.8, 0.88, 0.96, fill=False, stroke=True)
        pdf.rect(50, y - 55, 512, 65, fill=True, stroke=True)
        
        pdf.text_color(0.01, 0.41, 0.63)
        pdf.text(65, y - 10, f"{d} — {title}", size=11, font="F2")
        pdf.text_color(0.18, 0.24, 0.3)
        pdf.text(65, y - 27, f"Attire: {dress}", size=9.5, font="F1")
        pdf.text_color(0.35, 0.4, 0.45)
        pdf.text(65, y - 43, f"Note / To Bring: {bring}", size=9, font="F1")
        y -= 80
        
    with open(path, "wb") as f:
        f.write(pdf.build())


def create_photo_booklet_pdf(path):
    pdf = SimplePDF()
    
    # Page 1: Cover
    pdf.color(0.1, 0.15, 0.25, fill=True, stroke=False)
    pdf.rect(30, 30, 552, 732, fill=True, stroke=False)
    
    pdf.text_color(1, 1, 1)
    pdf.text(60, 530, "NAFL CLASSROOM MOMENTS", size=22, font="F2")
    pdf.text(60, 490, "Montessori 1A — Photo Booklet", size=16, font="F1")
    pdf.text(60, 440, "NOVEMBER 2026 HIGHLIGHTS", size=24, font="F2")
    
    pdf.text_color(0.95, 0.85, 0.5)
    pdf.text(60, 370, "Capturing Smiles, Sensorial Discoveries & Community Helpers", size=12, font="F1")
    pdf.text_color(0.8, 0.85, 0.9)
    pdf.text(60, 320, "Published by: Ms. Ananya (Class Teacher) | National Academy For Learning", size=10, font="F1")
    pdf.add_page()
    
    # Page 2: Highlights
    pdf.color(0.1, 0.15, 0.25, fill=True, stroke=False)
    pdf.rect(30, 720, 552, 42, fill=True, stroke=False)
    pdf.text_color(1, 1, 1)
    pdf.text(50, 735, "NOVEMBER 2026 CLASSROOM HIGHLIGHTS", size=14, font="F2")
    
    boxes = [
        ("Children's Day Celebration (Nov 14)", "The classroom was filled with laughter and colorful traditional attire as the children celebrated childhood with joyful songs, balloon games, and shared healthy tiffin with friends."),
        ("Community Helpers Day (Nov 20)", "From junior doctors with stethoscopes to brave little firefighters and chefs with chef hats! The children enthusiastically introduced their helper tools during circle time."),
        ("Sandpaper Letters & Phonics Discovery", "Mont 1A children engaged in tracing letters /s/, /a/, and /t/ with sensorial concentration, connecting sounds with miniature objects."),
        ("Sensorial Cylinders & Balance Towers", "Independent activity cycles showcasing focus, self-correction, and collaborative peer learning.")
    ]
    y = 660
    for title, desc in boxes:
        pdf.color(0.97, 0.98, 1.0, fill=True, stroke=False)
        pdf.color(0.85, 0.88, 0.95, fill=False, stroke=True)
        pdf.rect(50, y - 60, 512, 70, fill=True, stroke=True)
        
        pdf.text_color(0.01, 0.41, 0.63)
        pdf.text(65, y - 10, title, size=11, font="F2")
        pdf.text_color(0.15, 0.2, 0.25)
        pdf.text(65, y - 30, desc[:90], size=9.5, font="F1")
        if len(desc) > 90:
            pdf.text(65, y - 45, desc[90:], size=9.5, font="F1")
        y -= 85

    with open(path, "wb") as f:
        f.write(pdf.build())


if __name__ == "__main__":
    out_dir = "sample_artefacts"
    pub_dir = "web/public/samples"
    os.makedirs(out_dir, exist_ok=True)
    os.makedirs(pub_dir, exist_ok=True)
    
    files = [
        ("CIR_2026_27_025_Annual_Athletic_Meet_2026.pdf", create_circular_pdf),
        ("NAFL_Mont1_December_2026_Curriculum_Plan.pdf", create_curriculum_deck_pdf),
        ("NAFL_Mont1_Classroom_Moments_Nov2026.pdf", create_photo_booklet_pdf),
    ]
    
    for fname, func in files:
        p1 = os.path.join(out_dir, fname)
        p2 = os.path.join(pub_dir, fname)
        func(p1)
        shutil.copyfile(p1, p2)
        print(f"Generated {p1} ({os.path.getsize(p1)} bytes)")
