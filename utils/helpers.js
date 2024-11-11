export const formatDate = (dateString) => {
  const [month, day, year] = dateString.split('-');
  return new Date(`${year}-${month}-${day}T00:00:00`);
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const formatDistance = (distance) => {
  if (distance > 5280) {
    const miles = distance / 5280;
    return `${miles.toFixed(2)} miles`;
  } else {
    return `${distance.toFixed(0)} ft`;
  }
};

export const formatDistanceInFeet = (distanceInKm) => {
  const distanceInFeet = distanceInKm * 3280.84;
  return distanceInFeet > 5280
    ? `${(distanceInFeet / 5280).toFixed(2)} miles`
    : `${distanceInFeet.toFixed(0)} ft`;
};

export const getPlacePhotoUrl = (photo_reference, apiKey) => {
  return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo_reference}&key=${apiKey}`;
};

export const charityFishingTournament = `When Matthew Sanchez (Hayden’s grandson) was diagnosed with Type 1 diabetes seven years ago at the age of five, the family decided to use the Hayden Blaylock Key West Challenge presented by Sunshine Gasoline Distributors to help the Diabetes Research Institute (DRI) continue its efforts to search for a cure through cellular transplant therapy. To date, nearly $925,000 has been contributed to the DRI.

At the ceremony, tournament board members, Shell Oil representatives, and Blaylock-Sanchez family members were recognized for their efforts by DRI Foundation President and CEO Robert A. Pearlman. “As a thank you for your generous efforts and commitment to helping the DRI find a cure for Type 1 diabetes, we have dedicated a room here at the Institute to show our appreciation for your continuing support,” Pearlman said. “We are proud to have Blaylock Oil and Shell as part of the DRI’s family and hope to continue this relationship for years to come.”

The room now bearing the inscription “Shell Key West Challenge in honor of Matthew Sanchez” is in the office of one of the DRI’s leading scientists, Dr. Luca Inverardi, who met and befriended the Sanchez family upon Matthew’s diagnosis. Appropriately for the dedication, Dr. Inverardi is an avid fisherman who has participated in the tournament for the past five years.`;

export const benefitingTheDRI = `Dear Friends, I am thrilled to be welcoming all of you to the 2023 Sunshine Key West Challenge presented by Sunshine Gasoline Distributors! After more than a year in isolation, it’s incredibly gratifying to reconnect with our community of supporters, as well as friends, old and new, in the safest way possible. This longstanding event has helped raise over one million dollars for the cure-focused work of the Diabetes Research Institute. We would not be where we are today without compassionate people like you.

We lived by the mantra “Hope Isn’t Quarantined” throughout the pandemic, and our mission to find a cure for diabetes continued. DRI scientists worked virtually from their home offices, writing research papers and moving critical experiments forward while socially distancing in the lab. As one of our scientists, Dr. Chris Fraker, who lives with Type l diabetes himself, has said, “This disease doesn’t stop, and we’re not stopping either." The pandemic has underscored the urgent need to cure diabetes now, as we know how vulnerable the diabetes community is to COVID-19 complications. We will continue advancing research to patients until we reach our ultimate goal of a cure. This is our mission and our promise to you.

The ongoing support of Shell, Shell Lubricants and Motiva Enterprises, Sunshine Gasoline Distributors, and people like Crystal Blaylock and John Sanchez and their sons, Matthew and Cameron, as well as all of the hardworking people who helped to make this event a success, is what enables us to continuously move forward.

With your help, we will find a cure for millions of people, including Matthew Sanchez, living with type l diabetes. Thank you so much for being here and for your tremendous support. Enjoy the weekend in Key West and be safe. Sean Kramer CEO Diabetes Research Institute Foundation.`;

export const over$4MillionRaised = `Since its inception in 1989, the annual Sunshine Key West Challenge presented by Sunshine Gasoline Distributors tournament has provided an excellent opportunity for Shell employees, jobbers, and vendors to gather together for three days of outstanding fishing in the fabulous Florida Keys. But more importantly, each year, the tournament raises thousands of dollars for charities. In fact, during the past 25 years, more than $2 million in contributions have been made, first to the National Mental Health Association and over $925,000 to the Diabetes Research Institute.

The Shell Key West Challenge was the brainchild of Jo and Hayden Blaylock, of Blaylock Oil Company in Homestead, Florida, who in 1988 decided to create an event as a fundraiser for the National Mental Health Association. The tournament was almost immediately a great success, and within a few years, annual donations of $100,000 were commonplace. Jo was the driving force behind many of the more successful fundraising elements of the tournament and when she passed away in 1998 after a long and valiant battle with cancer, the tournament reached the $1 million mark in total contributions. In all, more than $1.7 million was donated to help promote mental health causes and eliminate the stigma of mental illness.`;

export const tournamentRules = `The tournament operating channel will be channel 08 and the backup channel 78. Any participating vessels with mechanical problems or breakdowns are to report to Findlay as soon as possible. All boats are to monitor channel 08 from 8:15 AM through 8:45 AM for the start each day.

Fishing is for two days — Friday, May 3rd and Saturday, May 4th. Each day, teams/ boats depart from their respective Key West docks between 7:45 AM and 8 AM, returning to the dock at 4 PM on Friday, May 3rd, and at 3 PM on Saturday, May 4th.

Fishing will commence each day with lines in the water announced at 8:30 AM on channel 08 and cease with lines out of the water announced on channel 08 at 3:30 PM Friday, May 3rd, and at 2:30 PM Saturday, May 4th. Fish hooked at the time of lines out of the water may be fought until boated or released and will be eligible for scoring.

Weight scales will be provided to each team/boat during the Thursday, May 2nd Captain’s Party, where teams will be paired with their boat. All eligible fish are to be weighed, and the weights and time of each catch are recorded.

The 2024 SKWC will predominantly be a DOLPHIN DERBY, where each participating boat/team will record the weight, time of catch, angler’s full name, Captain, and vessel’s name for each day’s largest three dolphins. The combined weights of the two largest dolphin, (largest dolphin from each day fishing, May 3rd and 4th respectively) will determine the 1st, 2nd, and 3rd place team standings. In the event of a tie, the fish with the earlier recorded time wins. There will also be 1st, 2nd, and 3rd place Team awards for the teams with the most combined billfish releases.

In addition to the team awards, 1st, 2nd, and 3rd place Largest Fish Awards will be presented to those individuals catching the heaviest fish from the following species list: Dolphin, Wahoo, Kingfish, Blackfin Tuna, Bonita, Snapper, Grouper, and Cobia.

For any questions or more information, please call our Tournament Rules Chairman, Findlay Sinclair at 305-849-1437. Tight lines and good luck!`;

export const tournamentAwards = `Team Awards:
  - 1st Place: 6 awards + 1 for Captain
  - 2nd Place: 6 awards + 1 for Captain
  - 3rd Place: 6 awards + 1 for Captain

  Point Schedule:
  - Dolphin: 2 points per pound (Largest 2 fish per day per team)
  - Kingfish: 1 point per pound (Largest 2 fish per day per team)
  - Blackfin Tuna: 1 point per pound (Largest 2 fish per day per team)
  - Snapper: 1 point per pound (Largest 2 fish per day per team)
  - Grouper: 1 point per pound (Largest 2 fish per day per team)
  - Cobia: 1 point per pound (Largest 2 fish per day per team)
  - Wahoo: 1 point per pound (Largest 2 fish per day per team)
  - Billfish Release: 25 points each release (no limit, all count)

  Largest Fish Awards:
  - Dolphin: 1st, 2nd, 3rd
  - Wahoo: 1st, 2nd
  - Blackfin Tuna: 1st, 2nd, 3rd
  - Snapper: 1st, 2nd
  - Grouper: 1st, 2nd
  - Cobia: 1st, 2nd
  - Kingfish: 1st, 2nd, 3rd
  - Most Billfish Releases: 1st, 2nd, 3rd`;