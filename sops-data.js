const SOPS_DATA = {
 "sites": {
  "Google": {
   "name": "Google",
   "verification": "BDM Email Verification",
   "url": "business.google.com",
   "steps": [
    "Search the business name and suburb in Google Maps first \u2014 a listing usually already exists and must be CLAIMED, not created.",
    "On the listing, choose 'Claim this business' / 'Own this business?'.",
    "Sign in with the account that should own the profile long term, not a personal one.",
    "Choose a verification method. Google decides what is offered: video, phone, text, email, or postcard.",
    "Video verification is now common for healthcare and often requires showing signage, the premises and proof of management.",
    "Once verified, set category to Dentist, add hours, phone and website exactly as per the NAP source of truth."
   ],
   "notes": "Google chooses the verification method; you cannot pick it. Video verification can require a live walkthrough, so book time with the practice rather than attempting it cold.",
   "confidence": "standard"
  },
  "Apple": {
   "name": "Apple",
   "verification": "Phone & Email",
   "url": "businessconnect.apple.com",
   "steps": [
    "Sign in at Apple Business Connect with an Apple Account.",
    "Search for the business \u2014 Apple Maps usually already holds a record.",
    "Claim it and complete the business verification steps Apple offers.",
    "Verification is typically by business email on a matching domain, or by phone call to the listed number.",
    "Set the category, hours and Place Card details once approved."
   ],
   "notes": "Apple reviews claims manually and can take several days. A generic Gmail address will usually fail domain-based verification.",
   "confidence": "standard"
  },
  "LinkedIn": {
   "name": "LinkedIn",
   "verification": "BDM Email Verification",
   "url": "linkedin.com/company/setup/new/",
   "steps": [
    "Check whether a Company Page already exists.",
    "To create one, the personal LinkedIn account must meet LinkedIn's account age and connection requirements.",
    "Creating a Page requires a verified email address on the company's own domain.",
    "If a Page exists, request admin access from the existing admin, or use LinkedIn's claim process."
   ],
   "notes": "The company-domain email requirement means this normally needs the practice, not the agency.",
   "confidence": "standard"
  },
  "Facebook": {
   "name": "Facebook",
   "verification": "Phone & Email",
   "url": "business.facebook.com",
   "steps": [
    "Check whether a Page already exists \u2014 unofficial Pages are often auto-generated from check-ins.",
    "If it exists and nobody has access, request access via Meta Business Suite, or lodge a Page claim.",
    "If not, create a new Page with the correct category and complete the About section with the exact NAP.",
    "Have the practice grant the agency a role on the Page rather than sharing their personal login."
   ],
   "notes": "Access is granted by an existing admin, so this is client-gated in practice. Never ask a client for their personal Facebook password.",
   "confidence": "standard"
  },
  "Bing": {
   "name": "Bing",
   "verification": "BDM Email Verification",
   "url": "bingplaces.com",
   "steps": [
    "Go to Bing Places for Business and sign in with a Microsoft account.",
    "Use 'Import from Google Business Profile' if the GBP is already live and verified \u2014 this is by far the fastest route.",
    "If importing is not possible, search for the business and claim it, or add it new.",
    "Verify by phone, email or postcard depending on what Bing offers.",
    "Confirm the imported NAP matches the source of truth; imports can carry across old data."
   ],
   "notes": "Do GBP first. Importing removes almost all the manual work here.",
   "confidence": "standard"
  },
  "Yelp": {
   "name": "Yelp",
   "verification": "Phone Verification",
   "url": "biz.yelp.com",
   "steps": [
    "Search Yelp for the business \u2014 many listings already exist from user submissions.",
    "Claim the listing via Yelp for Business.",
    "Yelp verifies by automated phone call or text to the publicly listed business number.",
    "Someone must be at the practice phone to take the code."
   ],
   "notes": "The call goes to the listed business number, so coordinate a time with the front desk. Yelp AU traffic is low; treat as a NAP citation rather than a lead source.",
   "confidence": "standard"
  },
  "Foursquare": {
   "name": "Foursquare",
   "verification": "BDM Email Verification",
   "url": "foursquare.com",
   "steps": [
    "Search for the venue \u2014 it likely exists already from user check-ins.",
    "Claim the venue through the business tools.",
    "Verification is normally by phone call to the listed number, or by card payment in some regions.",
    "Foursquare data feeds other apps, so NAP accuracy here propagates."
   ],
   "notes": "Foursquare has repeatedly changed its business products. Confirm the current claim path before quoting a process to anyone.",
   "confidence": "standard"
  },
  "American Express": {
   "name": "American Express",
   "verification": "Verification",
   "url": "americanexpress.com",
   "steps": [],
   "notes": "",
   "confidence": ""
  },
  "Here": {
   "name": "Here",
   "verification": "BDM Email Verification",
   "url": "here.com",
   "steps": [],
   "notes": "",
   "confidence": ""
  },
  "TomTom": {
   "name": "TomTom",
   "verification": "BDM Email Verification",
   "url": "tomtom.com",
   "steps": [],
   "notes": "",
   "confidence": ""
  },
  "Nextdoor": {
   "name": "Nextdoor",
   "verification": "BDM Email Verification",
   "url": "business.nextdoor.com",
   "steps": [
    "Create a Nextdoor business page and search for the business address.",
    "Verification is address-based and may require a postcard to the premises.",
    "The account is tied to a person, so decide who at the practice holds it."
   ],
   "notes": "Address/postcard verification means the practice must retrieve the code. Client-gated.",
   "confidence": "standard"
  },
  "True Local": {
   "name": "True Local",
   "verification": "BDM Email Verification",
   "url": "truelocal.com.au",
   "steps": [
    "Search True Local for the business \u2014 a listing usually already exists.",
    "If it exists, CLAIM it first. You cannot edit anything until the listing is claimed.",
    "If it does not exist, add the business from the list-your-business page and create an account.",
    "Once claimed, manage everything through the Business Centre (profile icon, top right).",
    "Update details by content category in the Business Centre.",
    "Record the login against the client in the password manager, not in the tracker sheet."
   ],
   "notes": "Verified 15 Sep 2026 against the True Local help centre. Changes to business name, phone, location, images and deals go through moderation and can take up to 48 hours, so do not mark a citation live on the same day. Owned by Sensis, same group as Yellow Pages.",
   "confidence": "verified"
  },
  "Health Direct": {
   "name": "Health Direct",
   "verification": "Email Verification",
   "url": "healthdirect.gov.au",
   "steps": [
    "This is NOT an ordinary directory listing. It is the National Health Services Directory, run by Healthdirect Australia and funded by government.",
    "Check first whether the practice is already listed, via the Service Finder at healthdirect.gov.au/australian-health-services.",
    "If already listed, use 'suggest an edit' on the listing to request an update.",
    "If not listed, the practice registers either directly with the NHSD or through Provider Connect Australia.",
    "Registration requires full healthcare service details including practitioner and ABN information.",
    "Submitted information is validated by Healthdirect before it appears.",
    "Escalation contact for listing problems is nhsd@healthdirect.org.au."
   ],
   "notes": "Verified 15 Sep 2026 against healthdirect.gov.au. THE PRACTICE MUST DO THIS, NOT THE AGENCY \u2014 it requires ABN and practitioner data the agency should not be submitting on their behalf. Treat as permanently client-gated. Validation before publication means turnaround is not immediate.",
   "confidence": "verified"
  },
  "Kompass": {
   "name": "Kompass",
   "verification": "BDM Email Verification",
   "url": "kompass.com",
   "steps": [],
   "notes": "",
   "confidence": ""
  },
  "Local Search": {
   "name": "Local Search",
   "verification": "Email Verification",
   "url": "localsearch.com.au",
   "steps": [],
   "notes": "",
   "confidence": ""
  },
  "Yahoo": {
   "name": "Yahoo",
   "verification": "Email Verification",
   "url": "yahoo.com",
   "steps": [],
   "notes": "",
   "confidence": ""
  },
  "Infobel": {
   "name": "Infobel",
   "verification": "BDM Email Verification",
   "url": "infobel.com",
   "steps": [],
   "notes": "",
   "confidence": ""
  },
  "Health Engine": {
   "name": "Health Engine",
   "verification": "Email Verification",
   "url": "healthengine.com.au",
   "steps": [],
   "notes": "",
   "confidence": ""
  },
  "Word of Mouth": {
   "name": "Word of Mouth",
   "verification": "BDM Email Verification",
   "url": "wordofmouth.com.au",
   "steps": [],
   "notes": "",
   "confidence": ""
  },
  "Cybo": {
   "name": "Cybo",
   "verification": "BDM Email Verification",
   "url": "cybo.com",
   "steps": [],
   "notes": "",
   "confidence": ""
  },
  "Yellow Pages": {
   "name": "Yellow Pages",
   "verification": "Phone Verification",
   "url": "yellowpages.com.au",
   "steps": [],
   "notes": "",
   "confidence": ""
  },
  "What Clinic": {
   "name": "What Clinic",
   "verification": "Phone Verification",
   "url": "whatclinic.com",
   "steps": [],
   "notes": "",
   "confidence": ""
  },
  "White Pages": {
   "name": "White Pages",
   "verification": "Phone Verification",
   "url": "whitepages.com.au",
   "steps": [],
   "notes": "",
   "confidence": ""
  },
  "StartLocal": {
   "name": "StartLocal",
   "verification": "BDM Email Verification",
   "url": "startlocal.com.au",
   "steps": [],
   "notes": "",
   "confidence": ""
  },
  "VY Maps": {
   "name": "VY Maps",
   "verification": "BDM Email Verification",
   "url": "vymaps.com",
   "steps": [],
   "notes": "",
   "confidence": ""
  },
  "Health Share": {
   "name": "Health Share",
   "verification": "BDM Email Verification",
   "url": "healthshare.com.au",
   "steps": [],
   "notes": "",
   "confidence": ""
  },
  "Top Rated Online": {
   "name": "Top Rated Online",
   "verification": "BDM Email Verification",
   "url": "top-rated.online",
   "steps": [],
   "notes": "",
   "confidence": ""
  },
  "My Community Directory": {
   "name": "My Community Directory",
   "verification": "BDM Email Verification",
   "url": "mycommunitydirectory.com.au",
   "steps": [],
   "notes": "",
   "confidence": ""
  },
  "My Health 1st": {
   "name": "My Health 1st",
   "verification": "BDM Email Verification",
   "url": "myhealth1st.com.au",
   "steps": [],
   "notes": "",
   "confidence": ""
  },
  "Three Best Rated": {
   "name": "Three Best Rated",
   "verification": "BDM Email Verification",
   "url": "threebestrated.com.au",
   "steps": [],
   "notes": "",
   "confidence": ""
  },
  "Healthcare Link": {
   "name": "Healthcare Link",
   "verification": "BDM Email Verification",
   "url": "healthcarelink.com.au",
   "steps": [],
   "notes": "",
   "confidence": ""
  },
  "Aus Health Pages": {
   "name": "Aus Health Pages",
   "verification": "Phone Verification",
   "url": "aushealthpages.com.au",
   "steps": [],
   "notes": "",
   "confidence": ""
  },
  "Fixed Dental": {
   "name": "Fixed Dental",
   "verification": "No Verification",
   "url": "fixeddental.com.au",
   "steps": [],
   "notes": "",
   "confidence": ""
  },
  "Dentist.com.au": {
   "name": "Dentist.com.au",
   "verification": "BDM Email Verification",
   "url": "dentist.com.au",
   "steps": [],
   "notes": "",
   "confidence": ""
  }
 }
};
