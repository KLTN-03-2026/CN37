public static class VectorHelper
{
    public static double CosineSimilarity(
        List<float> vector1,
        List<float> vector2)
    {
        double dot = 0;
        double norm1 = 0;
        double norm2 = 0;

        for (int i = 0; i < vector1.Count; i++)
        {
            dot += vector1[i] * vector2[i];
            norm1 += Math.Pow(vector1[i], 2);
            norm2 += Math.Pow(vector2[i], 2);
        }

        return dot /
            (Math.Sqrt(norm1)
            * Math.Sqrt(norm2));
    }
}