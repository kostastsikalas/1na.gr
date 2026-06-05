def to_title_case(text):
    if not isinstance(text, str): return ""
    return ' '.join(w.capitalize() for w in text.split())

print(to_title_case("ΝΟΜΙΚΗΣ (ΑΘΗΝΑ)"))
print(to_title_case("ΜΑΘΗΜΑΤΙΚΩΝ ΚΑΙ ΕΦΑΡΜΟΣΜΕΝΩΝ ΜΑΘΗΜΑΤΙΚΩΝ"))
