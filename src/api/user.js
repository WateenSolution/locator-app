import axios from 'axios';

export async function postLocation(deviceid, lat, lng) {
  console.log('postLocation called');
  const response = await axios.post('http://172.29.24.141:3000/post', {
    id: deviceid,
    lat: lat,
    longs: lng,
  });

  console.log(response.data);

  // const token = response.data.access_token;

  return response.data;
}
