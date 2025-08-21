// Photo mapping utility for candidate photos
const candidatePhotos = {
  'PRAVEEN KUMAR JHA': '/candidates/PRAVEEN_KUMAR_JHA.png',
  'ALKESH PARASHAR': '/candidates/ALKESH_PARASHAR.png',
  'ASHISH BANSAL (ZINNIA)': '/candidates/ASHISH_BANSAL_(ZINNIA).png',
  'ASHISH BANSAL (ORCHID)': '/candidates/ASHISH_BANSAL_(ORCHID).png',
  'JYOTI VERMA': '/candidates/JYOTI_VERMA.png',
  'KAVITA GUPTA': '/candidates/KAVITA_GUPTA.png',
  'RAHUL KUMAR': '/candidates/RAHUL_KUMAR.png',
  'SUNIL KUMAR DWIVEDI': '/candidates/SUNIL_KUMAR_DWIVEDI.png',
  'SURESH KUMAR VERMA': '/candidates/SURESH_KUMAR_VERMA.png',
  'VAISHALI SINHA': '/candidates/VAISHALI_SINHA.png',
  'VIDIT SRIVASTAVA': '/candidates/VIDIT_SRIVASTAVA.png',
  'VIKRAM SINGH GURJAR': '/candidates/VIKRAM_SINGH_GURJAR.png',
  'VINAY KUMAR SEHRAWAT': '/candidates/VINAY_SEHRAWAT.png',
  'VINOD KUMAR SINGH': '/candidates/VINOD_KUMAR_SINGH.png',
  'VIPIN KUMAR SINGH': '/candidates/VIPIN_KUMAR_SINGH.png',
  // New candidates
  'AMIT KUMAR': '/candidates/AMIT_KUMAR.png',
  'ARUN KUMAR': '/candidates/ARUN_KUMAR.png',
  'MAHESH BHATI': '/candidates/MAHESH_BHATI.png',
  'NITIN ANAND': '/candidates/NITIN_ANAND.png',
  'VIJAY KUMAR SHARMA': '/candidates/VIJAY_KUMAR_SHARMA.png',
  'ANIT BHATI': '/candidates/ANIT_BHATI.png'
};

// Function to get candidate photo URL
export const getCandidatePhoto = (candidateName) => {
  // Try exact match first
  if (candidatePhotos[candidateName]) {
    return candidatePhotos[candidateName];
  }
  
  // Try case-insensitive match
  const upperName = candidateName.toUpperCase();
  if (candidatePhotos[upperName]) {
    return candidatePhotos[upperName];
  }
  
  // Try partial match (in case names don't match exactly)
  for (const [photoName, photoPath] of Object.entries(candidatePhotos)) {
    if (photoPath && (upperName.includes(photoName) || photoName.includes(upperName))) {
      return photoPath;
    }
  }
  
  // Return null if no match found
  return null;
};

// Function to get initials as fallback
export const getInitials = (name) => {
  return name.split(' ').map(word => word[0]).join('').slice(0, 2);
};

// Function to test if photo exists
export const testPhotoExists = async (photoUrl) => {
  if (!photoUrl) return false;
  try {
    const response = await fetch(photoUrl, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    console.log('Photo not found:', photoUrl);
    return false;
  }
};

export default candidatePhotos;
