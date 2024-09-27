import {z} from "zod";

const courseModel = z.object({
    title:  z.string(),
    description: z.string().min(10),
    price: z.number()
})

const coursesArrayModel = z.array(courseModel);

export {
    courseModel,
    coursesArrayModel
}
