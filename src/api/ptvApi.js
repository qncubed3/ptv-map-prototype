const PTV_API_BASE = "https://utes5bgbyl.execute-api.ap-southeast-2.amazonaws.com/default/PTV_API";

export async function callPTVAPI(...args) {

    const url = new URL(PTV_API_BASE);

    args.forEach((value, index) => {
        url.searchParams.set(`arg${index + 1}`, value);
    });

    console.log(url);

    const response = await fetch(url);
    console.log('PTV response status:', response.status);
    // console.log('PTV response body (text):', await response.text());
    if (!response.ok) {
        throw new Error(`PTV API error: ${response.status}`)
    }
    const data = await response.json();
    // console.log(data);
    return data;
}