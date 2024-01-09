import axios from "axios";

export default async function handler(req, res) {
  const { filename } = req.query;
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  try {
    const { data: fileInfos } = await axios.get(
      `${baseUrl}/api/upload/files?filters[name][$eq]=${filename}`
    );
    if (fileInfos.length === 0)
      return res.status(404).json({ message: "File not found" });

    const { data } = await axios.get(baseUrl + fileInfos[0].url, {
      responseType: "stream",
    });

    res.setHeader("Content-Type", "image/png");
    data.pipe(res);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
}
