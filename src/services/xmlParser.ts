export function parseParticipantXML(xmlString: string): any {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, 'text/xml');

    const participant = xmlDoc.querySelector('Edu_Participant');
    if (!participant) return null;

    return {
        id: participant.querySelector('id')?.textContent || '',
        code: participant.querySelector('sCode')?.textContent || '',
        lastName: participant.querySelector('sLastName')?.textContent || '',
        middleName: participant.querySelector('sMiddleName')?.textContent || '',
        firstName: participant.querySelector('sFirstName')?.textContent || '',
        fullName: participant.querySelector('sFIO')?.textContent || '',
        organizationId: participant.querySelector('idOrganization')?.textContent || '',
        organizationName: participant.querySelector('idOrganizationHL')?.textContent || '',
    };
}

export function parseCourseXML(xmlString: string): any {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, 'text/xml');

    const course = xmlDoc.querySelector('Edu_Course');
    if (!course) return null;

    return {
        id: course.querySelector('id')?.textContent || '',
        code: course.querySelector('sCode')?.textContent || '',
        name: course.querySelector('sCourseHL')?.textContent || '',
        description: course.querySelector('sDescription')?.textContent || '',
        durationDays: parseInt(course.querySelector('nDurationInDays')?.textContent || '0'),
        pricePerPerson: parseInt(course.querySelector('nPricePerPerson')?.textContent || '0'),
    };
}

export function importFromXML(xmlString: string, type: 'participant' | 'course'): any {
    if (type === 'participant') {
        return parseParticipantXML(xmlString);
    } else if (type === 'course') {
        return parseCourseXML(xmlString);
    }
    return null;
}